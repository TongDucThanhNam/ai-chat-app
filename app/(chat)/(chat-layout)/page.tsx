import ChatInterface from "@/components/chat/ChatInterface";
import ChatTopbar from "@/components/chat/ChatHeader/ChatTopbar";

//force static
// export const dynamic = "force-static"; // force static

export default async function Home() {
  return (
    <main className="flex flex-col h-screen w-full">
      {/* Top bar with fixed height */}
      <ChatTopbar />

      {/* Chat interface that takes up remaining space */}
      <div className="flex-1 overflow-auto">
        <ChatInterface myMessages={[]} />
      </div>
    </main>
  );
}
