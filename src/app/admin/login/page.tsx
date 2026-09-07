'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setIsMounted(true);
      }
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      // Success - redirect to admin dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Đã xảy ra lỗi không mong muốn');
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#1E1B18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1E1B18] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Warm Backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#EAAA08]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#5C4B3E]/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#FAF8F5]/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative space-y-8">
        {/* Brand logo & header */}
        <div className="text-center space-y-2">
          <span className="text-4xl">🍳</span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Trang Quản Trị EGGU
          </h1>
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
            Đăng nhập hệ thống quản lý
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-200 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
              Địa chỉ Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eggu.vn"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#EAAA08] focus:bg-white/10 transition text-white placeholder-neutral-500 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#EAAA08] focus:bg-white/10 transition text-white placeholder-neutral-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#EAAA08] text-[#1E1B18] font-extrabold uppercase tracking-widest rounded-xl hover:bg-[#EAAA08]/90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
