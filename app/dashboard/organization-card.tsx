"use client";

import { Fragment, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ActiveOrganization,
  organization,
  useListOrganizations,
  useSession,
} from "@/lib/auth-client";
import { Session } from "@/lib/db/schema/authSchema";

interface OrganizationPanelProps {
  session: Session | null;
  activeOrganization: ActiveOrganization | null;
  currentOrg: {
    name: string;
    memberCount: number;
  };
  members: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
}

export default function OrganizationPanel({
  activeOrganization,
  session,
  currentOrg = { name: "Personal", memberCount: 1 },
  members = [
    {
      id: "1",
      name: "Nam Tóng",
      role: "Owner",
      avatar: "https://placehold.co/50x50",
    },
  ],
}: OrganizationPanelProps) {
  const organizations = useListOrganizations();
  const [optimisticOrg, setOptimisticOrg] = useState<ActiveOrganization | null>(
    activeOrganization,
  );
  const inviteVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };
  const currentMember = optimisticOrg?.members.find(
    (member) => member.userId === session?.userId,
  );

  console.log("Organizations: ", organizations);
  console.log("optimisticOrg: ", optimisticOrg);
  return (
    <Fragment>
      <div className="rounded-lg border border-border bg-black p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Organization</h2>

          <Button size="sm" className="gap-2" variant="default">
            <Plus size={16} />
            <p>New Organization</p>
          </Button>
        </div>
        {/*
        {organizations.data!.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {organizations.data!.map((org: any) => (
              <div
                key={org.id}
                className="flex h-12 w-12 items-center justify-center rounded bg-neutral-800 text-lg font-medium"
              >
                {org.name.charAt(0)}
              </div>
            ))}
          </div>
        )} */}

        <div className="mt-4 flex items-center">
          <button className="flex items-center gap-2 text-lg">
            <span>{currentOrg.name}</span>
            <ChevronDown className="h-5 w-5 text-neutral-400" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-neutral-800 text-lg font-medium">
            P
          </div>
          <div>
            <div className="font-medium">{currentOrg.name}</div>
            <div className="text-sm text-neutral-400">
              {currentOrg.memberCount} members
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-medium text-neutral-300">
              Members
            </h3>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={`${member.name}'s avatar`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-neutral-400">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="mb-4 text-lg font-medium text-neutral-300">
              Invites
            </h3>
            <p className="text-sm text-neutral-400">
              You can&apos;t invite members to your personal workspace.
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
