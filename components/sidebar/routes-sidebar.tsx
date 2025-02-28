import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { CarFrontIcon, GitPullRequestDraft, LayoutIcon } from "lucide-react";
import { auth } from "@/auth";
import { SideBarItem } from "./sidebar-item";

export const RoutesSidebar = async () => {
  const session = await auth();
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SideBarItem href="/" label="Início" icon={<LayoutIcon />} />
            <SideBarItem
              href={`/carros/${session?.user?.id}`}
              label="Meus carros"
              icon={<CarFrontIcon />}
            />
            <SideBarItem
              href={`/solicitacoes/${session?.user?.id}`}
              label="Solicitações"
              icon={<GitPullRequestDraft />}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
