"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "@/lib/auth-client";

export default function SignIn() {
  const { data } = useSession();

  return (
    <Button
      variant="outline"
      className={cn("w-full gap-2")}
      onClick={async () => {
        const data: any = await signIn.social({
          provider: "google",
          callbackURL: "/",
        });
        console.log("Sign in data: ", data);
      }}
    >
      Sign In with Google {data?.user?.email}
    </Button>
  );
}
