import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// import AccountSwitcher from "@/components/account-switch";
import UserCard from "./user.card";
import OrganizationPanel from "./organization-card";

export default async function DashboardPage() {
  const [session, activeSessions, deviceSessions, organization] =
    await Promise.all([
      auth.api.getSession({
        headers: await headers(),
      }),
      auth.api.listSessions({
        headers: await headers(),
      }),
      auth.api.listDeviceSessions({
        headers: await headers(),
      }),
      auth.api.getFullOrganization({
        headers: await headers(),
      }),
      // auth.api.listActiveSubscriptions({
      // 	headers: await headers(),
      // }),
    ]).catch((e) => {
      console.log(e);
      throw redirect("/login");
    });

  console.log("Device session", deviceSessions);
  return (
    <div className="w-full">
      <div className="flex gap-4 flex-col">
        {/* <AccountSwitcher
					sessions={JSON.parse(JSON.stringify(deviceSessions))}
				/> */}
        <UserCard
          session={JSON.parse(JSON.stringify(session))}
          activeSessions={JSON.parse(JSON.stringify(activeSessions))}
          // subscription={subscriptions.find(
          // 	(sub: any) => sub.status === "active" || sub.status === "trialing",
          // )}
        />
        <OrganizationPanel
          session={JSON.parse(JSON.stringify(session))}
          activeOrganization={JSON.parse(JSON.stringify(organization))}
          currentOrg={{
            memberCount: 1,
            name: "Personal",
          }}
          members={[
            {
              id: "1",
              name: "Nam Tóng",
              role: "Owner",
              avatar: "/mystical-forest-spirit.png",
            },
          ]}
        />
      </div>
    </div>
  );
}
