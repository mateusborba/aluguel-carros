import { auth } from "@/auth";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ToggleThemeButton } from "@/components/toggle-theme";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full justify-between">
              <SidebarTrigger className="-ml-1" />
              <div className="items-center gap-1.5 flex">
                <ToggleThemeButton />
              </div>
            </div>
          </header>
          <Separator />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-3">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
};

export default Layout;
