import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { ContactMessage, ContactMessageStatus } from '@/types/contact';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'contact-messages.json');

// Ensure data directory and file exist
function getLocalMessages(): ContactMessage[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content) as ContactMessage[];
  } catch (error) {
    console.error('Error reading local contact messages:', error);
    return [];
  }
}

function saveLocalMessages(messages: ContactMessage[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving local contact messages:', error);
  }
}

// GET: Fetch messages for admin dashboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const queryParam = searchParams.get('q')?.toLowerCase().trim();

    let messages: ContactMessage[] = [];
    let supabaseSuccess = false;

    // 1. Try fetching from Supabase first
    try {
      const supabase = createServiceRoleClient();
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusParam && statusParam !== 'ALL') {
        query = query.eq('status', statusParam);
      }

      const { data, error } = await query;
      if (!error && data) {
        messages = data as ContactMessage[];
        supabaseSuccess = true;
      }
    } catch {
      // Supabase table or query failed, fallback to local storage
    }

    // 2. Fallback to local storage if Supabase is unavailable
    if (!supabaseSuccess) {
      messages = getLocalMessages();
      if (statusParam && statusParam !== 'ALL') {
        messages = messages.filter((m) => m.status === statusParam);
      }
    }

    // Apply search filter if provided
    if (queryParam) {
      messages = messages.filter(
        (m) =>
          m.name.toLowerCase().includes(queryParam) ||
          m.phone.toLowerCase().includes(queryParam) ||
          (m.email && m.email.toLowerCase().includes(queryParam)) ||
          m.message.toLowerCase().includes(queryParam)
      );
    }

    // Sort by created_at descending
    messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Calculate overall stats from complete list
    let allMessages = messages;
    if (statusParam && statusParam !== 'ALL' || queryParam) {
      if (supabaseSuccess) {
        try {
          const supabase = createServiceRoleClient();
          const { data } = await supabase.from('contact_messages').select('*');
          if (data) allMessages = data as ContactMessage[];
        } catch {
          allMessages = getLocalMessages();
        }
      } else {
        allMessages = getLocalMessages();
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const stats = {
      total: allMessages.length,
      unread: allMessages.filter((m) => m.status === 'UNREAD').length,
      replied: allMessages.filter((m) => m.status === 'REPLIED').length,
      today: allMessages.filter((m) => m.created_at?.startsWith(todayStr)).length,
    };

    return NextResponse.json({
      success: true,
      messages,
      stats,
    });
  } catch (error) {
    console.error('API Contact GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải danh sách tin nhắn' },
      { status: 500 }
    );
  }
}

// POST: Public submission from Contact page
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Họ tên phải có ít nhất 2 ký tự' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json(
        { success: false, message: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Nội dung tin nhắn phải có ít nhất 5 ký tự' },
        { status: 400 }
      );
    }

    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: null,
      phone: phone.trim(),
      message: message.trim(),
      status: 'UNREAD',
      reply_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let savedToSupabase = false;

    // 1. Try Supabase insert
    try {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          id: newMessage.id,
          name: newMessage.name,
          email: newMessage.email,
          phone: newMessage.phone,
          message: newMessage.message,
          status: newMessage.status,
          reply_notes: null,
        })
        .select()
        .single();

      if (!error && data) {
        savedToSupabase = true;
        newMessage.id = data.id;
        newMessage.created_at = data.created_at;
        newMessage.updated_at = data.updated_at;
      }
    } catch {
      // Continue to local storage fallback
    }

    // 2. Always sync to local storage file as backup
    const localList = getLocalMessages();
    localList.unshift(newMessage);
    saveLocalMessages(localList);

    return NextResponse.json({
      success: true,
      message: 'Tin nhắn của bạn đã được gửi thành công!',
      data: newMessage,
      source: savedToSupabase ? 'database' : 'fallback',
    });
  } catch (error) {
    console.error('API Contact POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

// PATCH: Update message status or notes (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, reply_notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Thiếu ID tin nhắn' },
        { status: 400 }
      );
    }

    const updates: Partial<ContactMessage> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updates.status = status as ContactMessageStatus;
    }
    if (reply_notes !== undefined) {
      updates.reply_notes = reply_notes;
    }

    // 1. Try Supabase update
    try {
      const supabase = createServiceRoleClient();
      await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id);
    } catch {
      // Supabase table or query failed
    }

    // 2. Sync to local storage
    const localList = getLocalMessages();
    const index = localList.findIndex((m) => m.id === id);
    if (index !== -1) {
      localList[index] = {
        ...localList[index],
        ...updates,
      };
      saveLocalMessages(localList);
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật tin nhắn thành công',
    });
  } catch (error) {
    console.error('API Contact PATCH error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật tin nhắn' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a message (Admin)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Thiếu ID tin nhắn cần xóa' },
        { status: 400 }
      );
    }

    // 1. Try Supabase delete
    try {
      const supabase = createServiceRoleClient();
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch {
      // Supabase delete failed
    }

    // 2. Sync to local storage
    const localList = getLocalMessages();
    const filtered = localList.filter((m) => m.id !== id);
    saveLocalMessages(filtered);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa tin nhắn thành công',
    });
  } catch (error) {
    console.error('API Contact DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa tin nhắn' },
      { status: 500 }
    );
  }
}
