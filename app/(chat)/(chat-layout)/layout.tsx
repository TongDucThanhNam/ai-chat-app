import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SidebarLeft from "@/components/SideBarLeft/SidebarLeft";
import { SidebarRight } from "@/components/SidebarRight/SidebarRight";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { User } from "@/lib/db/schema/authSchema";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Sidebar left*/}
      <SidebarLeft user={session?.user as User} />

      {/* Main content */}
      <SidebarInset>{children}</SidebarInset>

      {/* Sidebar right */}
      <SidebarRight />
    </SidebarProvider>
  );
}
