"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error logging in: " + error.message);
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">로그인</h1>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">이메일</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">비밀번호</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={handleLogin}
        >
          로그인
        </button>
        <div className="text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <a href="/signup" className="font-medium text-blue-600 hover:underline">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
}
