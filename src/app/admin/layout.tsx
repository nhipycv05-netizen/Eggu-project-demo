import { Open_Sans, Geist_Mono } from 'next/font/google';
import '../globals.css';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'EGGU - Trang Quản Trị Hệ Thống',
  description: 'Trang quản trị hệ thống bánh mì trứng EGGU Hàn Quốc',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="vi" className={`${openSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900 font-sans">
        {children}
      </body>
    </html>
  );
}
