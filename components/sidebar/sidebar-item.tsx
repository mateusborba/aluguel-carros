"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuItem } from "../ui/sidebar";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SideBarItemProps {
  href: string;
  label: string;
  icon?: ReactNode;
}

export const SideBarItem = ({ href, label, icon }: SideBarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <>
      <Link href={href}>
        <SidebarMenuItem
          className={cn(
            "py-3 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-1.5",
            isActive && "bg-primary text-primary-foreground"
          )}
        >
          {icon}
          {label}
        </SidebarMenuItem>
      </Link>
    </>
  );
};
