export type ContactMessageStatus = 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';

export interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  status: ContactMessageStatus;
  reply_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactFormInput {
  name: string;
  email?: string | null;
  phone: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: ContactMessage;
}
