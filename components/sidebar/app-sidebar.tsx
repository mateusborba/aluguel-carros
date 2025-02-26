import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Car } from "lucide-react";
import { Separator } from "../ui/separator";
import { NavUser } from "./nav-user";
import { RoutesSidebar } from "./routes-sidebar";
import { auth } from "@/auth";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex-row gap-2.5 items-center justify-center space-x-6">
        <Car className="size-12 bg-background" />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="mt-3 px-3">
        <RoutesSidebar />
      </SidebarContent>
      <NavUser user={session?.user?.name} email={session?.user?.email} />
      <SidebarRail />
    </Sidebar>
  );
}
