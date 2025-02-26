"use client";

import { LayoutDashboard } from "lucide-react";
import React, { type ReactNode } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Route {
  name: string;
  path: string;
  icon: ReactNode;
}

const routes: Route[] = [
  {
    name: "Início",
    path: "/",
    icon: <LayoutDashboard className="size-4" />,
  },
];

export const RoutesSidebar = () => {
  const path = usePathname();

  const isActive = (routePath: string) => {
    if (path === routePath) {
      return true;
    }
    return false;
  };

  return (
    <>
      {routes?.map((route) => (
        <SidebarGroup key={route.path}>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                className={cn(
                  "py-3 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-1.5",
                  isActive(route.path) && "bg-primary text-background"
                )}
              >
                {route.icon}
                <Link href={route.path} className="">
                  {route.name}
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};
