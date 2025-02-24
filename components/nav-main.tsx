"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface Route {
  name: string;
  path: string;
}

const routes: Route[] = [
  {
    name: "Início",
    path: "/",
  },
];

export function NavMain() {
  const path = usePathname();

  console.log({ path });

  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((route) => (
          <Fragment key={route.path}>
            <SidebarMenuItem
              className={cn(
                "p-3 rounded-lg flex items-center gap-1.5",
                path === route.path && "bg-primary text-background"
              )}
            >
              <LayoutDashboard className="size-4" strokeWidth={2.5} />
              <Link href={route.path} className="font-medium">
                {route.name}
              </Link>
            </SidebarMenuItem>
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
