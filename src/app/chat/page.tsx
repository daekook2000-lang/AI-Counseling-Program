"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/landing");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">AI 멘탈 케어 메이트</h1>
        {user && (
          <div className="flex items-center">
            <p className="mr-4">{user.email}님 환영합니다</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              로그아웃
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Chat />
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800">자동 리포트</h2>
              <p className="text-gray-600">주간/월간 감정 변화와 과거 고민을 요약하여 보여줍니다.</p>
              <button className="mt-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">리포트 보기</button>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800">구독 모델</h2>
              <p className="text-gray-600">심층 분석 등 프리미엄 기능을 이용해보세요.</p>
              <button className="mt-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">구독하기</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "안녕하세요! 어떤 고민이 있으신가요?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const aiResponse = await response.text();
      setMessages(prevMessages => [...prevMessages, { from: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...newMessages,
        { from: "ai", text: "죄송합니다. 답변을 생성하는 동안 오류가 발생했습니다." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              msg.from === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                msg.from === "ai"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-blue-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700"
            onClick={sendMessage}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
