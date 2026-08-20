import ChatWindow from "@/components/chat/ChatWindow";

export const metadata = {
  title: "Companion Chat — EMO Assistant",
  description: "Have a safe, empathetic conversation with your mindful AI companion.",
};

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto py-2 space-y-4">
      <ChatWindow />
    </div>
  );
}
