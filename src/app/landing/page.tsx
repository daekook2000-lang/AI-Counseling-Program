import Link from 'next/link';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-6xl font-bold text-gray-800">AI 멘탈 케어 메이트에 오신 것을 환영합니다.</h1>
        <div className="flex justify-center space-x-4 pt-8">
          <Link href="/login" className="px-8 py-4 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700">로그인</Link>
          <Link href="/signup" className="px-8 py-4 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
