'use client';

import { useState, useEffect, useRef } from 'react';
import { AboutContent, DEFAULT_ABOUT_CONTENT } from '@/types/about';
import { createClient } from '@/lib/supabase/client';
import {
  Save,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  HeartHandshake,
  Check,
  Eye,
} from 'lucide-react';
import Image from 'next/image';

const LOCAL_STORAGE_KEY = 'eggu_about_content';

export default function AboutTab() {
  const supabase = createClient();
  const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingSection1, setUploadingSection1] = useState(false);
  const [uploadingSection3, setUploadingSection3] = useState(false);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  // Load existing content on mount
  useEffect(() => {
    const loadContent = async () => {
      // 1. Check localStorage first
      if (typeof window !== 'undefined') {
        const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            setContent((prev) => ({ ...prev, ...parsed }));
          } catch {
            // ignore parse error
          }
        }
      }

      // 2. Fetch from API or Supabase
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const data = await res.json();
          if (data && data.mainTitle) {
            setContent(data);
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            }
          }
        }
      } catch (err) {
        console.log('Using local/cached about data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Process image file helper (FileReader base64 + Supabase storage attempt)
  const handleUploadImage = async (
    file: File,
    section: 1 | 3
  ) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, GIF)!');
      return;
    }

    const setUploading = section === 1 ? setUploadingSection1 : setUploadingSection3;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        setContent((prev) => ({
          ...prev,
          ...(section === 1
            ? { section1Image: base64Data }
            : { section3Image: base64Data }),
        }));
      }

      // Attempt Supabase storage upload if available
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `about-sec${section}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('about')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('about').getPublicUrl(fileName);
          if (data?.publicUrl) {
            setContent((prev) => ({
              ...prev,
              ...(section === 1
                ? { section1Image: data.publicUrl }
                : { section3Image: data.publicUrl }),
            }));
          }
        }
      } catch {
        // Fallback: keep base64
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
        window.dispatchEvent(new CustomEvent('eggu_about_updated', { detail: content }));
      }

      // 2. Save via API
      await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Lỗi khi lưu dữ liệu:', err);
      alert('Có lỗi xảy ra khi lưu dữ liệu, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục về nội dung mặc định của EGGU?')) {
      setContent({ ...DEFAULT_ABOUT_CONTENT });
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#EAAA08] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Đang tải cấu hình Giới thiệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Save Actions Bar */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#FFF9E6] text-[#D97706] rounded-lg">
              <Info className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">
              Quản Lý Trang Giới Thiệu
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Chỉnh sửa tiêu đề, hình ảnh và 3 khối nội dung bố cục zic-zac phía người dùng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mặc định</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang Lưu...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-white stroke-[3]" />
                <span>Đã Lưu Xong!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>LƯU THAY ĐỔI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>Nội dung trang Giới thiệu đã được cập nhật và đồng bộ thành công!</span>
        </div>
      )}

      {/* Block 0: Tiêu đề chính & Tiêu đề phụ */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#FFF0F0] text-[#E53935] rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Tiêu Đề Trang
            </h2>
          </div>
          <span className="text-[11px] font-bold text-neutral-400">Khối mở đầu</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 block">
              Tiêu đề chính <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={content.mainTitle}
              onChange={(e) => setContent({ ...content, mainTitle: e.target.value })}
              placeholder="Ví dụ: VỀ CHÚNG TÔI"
              className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
            />
            <p className="text-[11px] text-neutral-400">Hiển thị ở cỡ chữ lớn (H1) trên trang Giới thiệu</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 block">
              Tiêu đề phụ / Tagline
            </label>
            <input
              type="text"
              value={content.subTitle}
              onChange={(e) => setContent({ ...content, subTitle: e.target.value })}
              placeholder="Ví dụ: Eggu - Sandwich trứng Hàn Quốc"
              className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
            />
            <p className="text-[11px] text-neutral-400">Dòng phụ đề nhỏ định vị thương hiệu</p>
          </div>
        </div>
      </section>

      {/* Block 1: Phần 1 - Chân dung / Khởi nguồn */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#FFF4E5] text-[#D97706] rounded-lg">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Phần 1: Chân Dung & Khởi Nguồn (Hộp Tối Đè Lên Ảnh)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#E53935] bg-[#FFF0F0] px-2 py-0.5 rounded-full">
            Khối 1 Zic-Zac
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">
                Ảnh Chân Dung / Bếp Bánh (Khối Bên Phải)
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={content.section1Image}
                  onChange={(e) => setContent({ ...content, section1Image: e.target.value })}
                  placeholder="Nhập link ảnh (ví dụ: /images/hero-sandwich.jpg hoặc URL)"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
                
                <input
                  type="file"
                  ref={fileInputRef1}
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadImage(f, 1);
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef1.current?.click()}
                  disabled={uploadingSection1}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingSection1 ? 'Đang Tải...' : 'Tải Tệp Ảnh'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Đoạn Văn Giới Thiệu Khởi Nguồn
              </label>
              <textarea
                rows={4}
                value={content.section1Text}
                onChange={(e) => setContent({ ...content, section1Text: e.target.value })}
                placeholder="Nhập đoạn văn bản giới thiệu ban đầu..."
                className="w-full p-3.5 text-xs leading-relaxed rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
              <p className="text-[11px] text-neutral-400">
                Đoạn văn này sẽ nằm trong hộp màu tối (<code>bg-[#54433a]/80</code>) đè nhẹ lên góc ảnh.
              </p>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="lg:col-span-5 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Xem trước Khối 1
              </span>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-200 shadow-sm">
              {content.section1Image ? (
                <Image
                  src={content.section1Image}
                  alt="Section 1 Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">Chưa có ảnh</span>
                </div>
              )}

              {/* Overlapping red glassmorphism card */}
              <div className="absolute bottom-3 left-3 right-8 bg-[#e0352b]/85 backdrop-blur-md text-white p-3.5 rounded-xl text-[11px] leading-relaxed shadow-lg border border-white/20">
                <p className="line-clamp-4 font-medium">{content.section1Text || 'Đoạn văn bản giới thiệu sẽ hiển thị ở đây...'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2: Phần 2 - Đoạn thông điệp nổi bật */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#F4EFE8] text-[#54433A] rounded-lg">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Phần 2: Thông Điệp Nổi Bật (Khung Bo Tròn Xám Nhạt Toàn Chiều Ngang)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#E53935] bg-[#FFF0F0] px-2 py-0.5 rounded-full">
            Khối 2 Zic-Zac
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-700 block">
            Đoạn Văn Bản Tâm Huyết
          </label>
          <textarea
            rows={4}
            value={content.section2Text}
            onChange={(e) => setContent({ ...content, section2Text: e.target.value })}
            placeholder="Nhập đoạn văn bản tâm huyết và triết lý ẩm thực..."
            className="w-full p-4 text-xs leading-relaxed rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
          />

          {/* Live Preview Box */}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 block mb-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Xem trước Khối 2:
            </span>
            <div className="w-full bg-[#f3eee7] rounded-2xl p-5 md:p-6 text-xs md:text-sm leading-relaxed text-[#444444] border border-[#e8dfd4] shadow-xs">
              <span className="text-xl block mb-1">“</span>
              <p className="font-medium italic">
                {content.section2Text || 'Nội dung thông điệp nổi bật nằm trong khung nền xám nhạt ấm áp...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Block 3: Phần 3 - Cam kết chất lượng & Sản phẩm */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#EDFDFD] text-[#0D9488] rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Phần 3: Tầm Nhìn Thương Hiệu (Ảnh Bên Trái - Chữ Bên Phải)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#E53935] bg-[#FFF0F0] px-2 py-0.5 rounded-full">
            Khối 3 Zic-Zac
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image (Cột Bên Trái) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">
                Ảnh Tầm Nhìn (Khung Bên Trái)
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={content.section3Image}
                  onChange={(e) => setContent({ ...content, section3Image: e.target.value })}
                  placeholder="Nhập link ảnh (ví dụ: /images/about-vision.jpg)"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />

                <input
                  type="file"
                  ref={fileInputRef3}
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadImage(f, 3);
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef3.current?.click()}
                  disabled={uploadingSection3}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingSection3 ? 'Đang Tải...' : 'Tải Tệp Ảnh'}</span>
                </button>
              </div>
            </div>

            {/* Preview Box for Image */}
            <div className="relative w-full max-w-[280px] mx-auto aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-200 border border-neutral-100 shadow-sm">
              {content.section3Image ? (
                <Image
                  src={content.section3Image}
                  alt="Section 3 Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">Chưa có ảnh</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Text & Closing Statement (Cột Bên Phải) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Tiêu Đề Tầm Nhìn (Tùy chọn)
              </label>
              <input
                type="text"
                value={content.section3Title || ''}
                onChange={(e) => setContent({ ...content, section3Title: e.target.value })}
                placeholder="Ví dụ: Tầm Nhìn Của Eggu"
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Nội Dung Văn Bản Tầm Nhìn (Cột Bên Phải)
              </label>
              <textarea
                rows={5}
                value={content.section3Text}
                onChange={(e) => setContent({ ...content, section3Text: e.target.value })}
                placeholder="Nhập nội dung văn bản tầm nhìn..."
                className="w-full p-3.5 text-xs leading-relaxed rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Dòng Kết Thúc / Khẩu Hiệu
              </label>
              <input
                type="text"
                value={content.section3ClosingText || ''}
                onChange={(e) => setContent({ ...content, section3ClosingText: e.target.value })}
                placeholder="Eggu - nơi mỗi người đều có thể tìm thấy ổ bánh mỳ “đúng với mình”."
                className="w-full px-3.5 py-2 text-xs font-medium italic rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
              <p className="text-[11px] text-neutral-400">
                Hiển thị nổi bật với đường viền đỏ thương hiệu ở cuối mục 3.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Block 4: Phần 4 - Giá trị cốt lõi (3 Thẻ Card Tối Giản) */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#FFF9E6] text-[#D97706] rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
              Phần 4: Giá Trị Cốt Lõi (3 Thẻ Card Tối Giản)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#E53935] bg-[#FFF0F0] px-2 py-0.5 rounded-full">
            Khối 4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(content.section4Items || DEFAULT_ABOUT_CONTENT.section4Items || []).map((item, idx) => (
            <div key={idx} className="bg-[#FAF8F5] p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-800">Thẻ {idx + 1}</span>
                <span className="text-[10px] font-bold text-[#D97706] bg-[#FFF4E5] px-2 py-0.5 rounded">Thẻ Card</span>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-600 block">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...(content.section4Items || DEFAULT_ABOUT_CONTENT.section4Items || [])];
                    newItems[idx] = { ...newItems[idx], title: e.target.value };
                    setContent({ ...content, section4Items: newItems });
                  }}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-600 block">
                  Nội dung mô tả
                </label>
                <textarea
                  rows={4}
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...(content.section4Items || DEFAULT_ABOUT_CONTENT.section4Items || [])];
                    newItems[idx] = { ...newItems[idx], description: e.target.value };
                    setContent({ ...content, section4Items: newItems });
                  }}
                  className="w-full p-2.5 text-xs leading-relaxed rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang Lưu Thay Đổi...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>LƯU THAY ĐỔI TOÀN BỘ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
