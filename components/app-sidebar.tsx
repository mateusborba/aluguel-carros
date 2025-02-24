import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { auth, signOut } from "@/auth";
import { Car } from "lucide-react";
import { Separator } from "./ui/separator";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <section className="px-3 h-full">
        <SidebarHeader className="flex items-center gap-2 flex-row">
          <Car className="size-10" />
          <p className="text-xl font-semibold mt-1">Rental Cars</p>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <NavMain />
        </SidebarContent>
      </section>
      <SidebarFooter>
        <NavUser
          user={session?.user?.name}
          email={session?.user?.email}
          onLogout={async () => {
            "use server";
            await signOut();
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
