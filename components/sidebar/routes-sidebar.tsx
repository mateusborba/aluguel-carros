import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CarFrontIcon, LayoutIcon } from "lucide-react";
import { auth } from "@/auth";

export const RoutesSidebar = async () => {
  const session = await auth();
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              className={cn(
                "py-3 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-1.5"
              )}
            >
              <LayoutIcon />
              <Link href="/" className="">
                Início
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem
              className={cn(
                "py-3 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-1.5"
              )}
            >
              <CarFrontIcon />
              <Link href={`/carros/${session?.user?.id}`} className="">
                Meus carros
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
