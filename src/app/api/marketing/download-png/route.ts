import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import zlib from 'zlib';

function crc32(buf: Buffer): number {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeZip(files: { name: string; data: Buffer }[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBuf = Buffer.from(f.name, 'utf8');
    const crc = crc32(f.data);
    const compressed = zlib.deflateRawSync(f.data);

    // Local File Header (30 bytes + nameBuf.length)
    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4); // version needed
    lh.writeUInt16LE(0, 6);  // flags
    lh.writeUInt16LE(8, 8);  // compression = deflate
    lh.writeUInt16LE(0, 10); // mod time
    lh.writeUInt16LE(0, 12); // mod date
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(compressed.length, 18);
    lh.writeUInt32LE(f.data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    nameBuf.copy(lh, 30);

    localHeaders.push(lh, compressed);

    // Central Directory Header (46 bytes + nameBuf.length)
    const ch = Buffer.alloc(46 + nameBuf.length);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4); // version made by
    ch.writeUInt16LE(20, 6); // version needed
    ch.writeUInt16LE(0, 8);  // flags
    ch.writeUInt16LE(8, 10); // compression
    ch.writeUInt16LE(0, 12); // time
    ch.writeUInt16LE(0, 14); // date
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(compressed.length, 20);
    ch.writeUInt32LE(f.data.length, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt16LE(0, 30); // extra len
    ch.writeUInt16LE(0, 32); // comment len
    ch.writeUInt16LE(0, 34); // disk start
    ch.writeUInt16LE(0, 36); // internal attr
    ch.writeUInt32LE(0, 38); // external attr
    ch.writeUInt32LE(offset, 42); // relative offset
    nameBuf.copy(ch, 46);

    centralHeaders.push(ch);
    offset += lh.length + compressed.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const ch of centralHeaders) cdSize += ch.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/**
 * GET handler:
 * - Single image: ?url=...&name=... -> Returns single .png file
 * - Batch images: ?urls=url1,url2,...&title=...&zip=true -> Returns a .zip containing all images converted to .png
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const singleUrl = searchParams.get('url');
    const urlsParam = searchParams.get('urls');
    const isZip = searchParams.get('zip') === 'true';
    const title = searchParams.get('title') || searchParams.get('name') || 'eggu-photo';
    const baseSlug = sanitizeFilename(title) || 'eggu-photo';

    // 1. Case: Batch zip download
    if (urlsParam || isZip) {
      let urls: string[] = [];
      if (urlsParam) {
        try {
          urls = urlsParam.startsWith('[') ? JSON.parse(urlsParam) : urlsParam.split(',');
        } catch {
          urls = urlsParam.split(',');
        }
      } else if (singleUrl) {
        urls = [singleUrl];
      }

      urls = urls.map((u) => u.trim()).filter((u) => u.startsWith('http'));

      if (urls.length === 0) {
        return NextResponse.json({ error: 'Không tìm thấy danh sách URL hợp lệ' }, { status: 400 });
      }

      const files: { name: string; data: Buffer }[] = [];

      // Fetch and convert all images in parallel
      const results = await Promise.allSettled(
        urls.map(async (url, idx) => {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const buf = Buffer.from(await resp.arrayBuffer());
          const pngBuf = await sharp(buf).png({ quality: 95 }).toBuffer();
          return {
            name: `${idx + 1}-${baseSlug}.png`,
            data: pngBuf,
          };
        })
      );

      for (const res of results) {
        if (res.status === 'fulfilled') {
          files.push(res.value);
        }
      }

      if (files.length === 0) {
        return NextResponse.json({ error: 'Không thể tải và chuyển đổi ảnh nào sang PNG' }, { status: 500 });
      }

      const zipBuf = makeZip(files);
      const zipName = `${baseSlug}-${files.length}-anh-png.zip`;

      return new Response(new Uint8Array(zipBuf), {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${zipName}"`,
          'Cache-Control': 'no-cache',
        },
      });
    }

    // 2. Case: Single image PNG download
    if (!singleUrl) {
      return NextResponse.json({ error: 'Thiếu URL ảnh' }, { status: 400 });
    }

    const resp = await fetch(singleUrl);
    if (!resp.ok) {
      return NextResponse.json({ error: `Không thể tải ảnh gốc: HTTP ${resp.status}` }, { status: resp.status });
    }

    const inputBuf = Buffer.from(await resp.arrayBuffer());
    const pngBuf = await sharp(inputBuf).png({ quality: 95 }).toBuffer();
    const fileName = `${baseSlug}.png`;

    return new Response(new Uint8Array(pngBuf), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('Lỗi khi tải hoặc convert ảnh sang PNG:', err);
    return NextResponse.json({ error: err.message || 'Lỗi server' }, { status: 500 });
  }
}
