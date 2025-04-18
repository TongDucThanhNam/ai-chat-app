import ChatComponent from "@/components/chat/ChatComponent";
// force dynamic
export const dynamic = "force-dynamic";

interface ChatStoredPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatStoredPage({ params }: ChatStoredPageProps) {
  const id = (await params).id;

  return (
    <main className="flex flex-col h-screen w-full">
      <ChatComponent chatId={id} />
    </main>
  );
}
