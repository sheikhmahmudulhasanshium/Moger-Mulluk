// app/[lang]/(routes)/chat/page.tsx
export default function ChatPage() {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Moger Mulluk Drive-Thru</h1>
      <p className="mb-8 text-gray-600">Quick order? Pick an option below:</p>
      
      <div className="flex flex-col gap-4">
        <button className="p-4 border rounded-xl hover:bg-orange-50 transition">
          ☕ I want to order Coffee
        </button>
        <button className="p-4 border rounded-xl hover:bg-orange-50 transition">
          🍛 What is the Daily Special?
        </button>
        <button className="p-4 border rounded-xl hover:bg-orange-50 transition">
          🙋 Speak to a Human
        </button>
      </div>
    </div>
  );
}