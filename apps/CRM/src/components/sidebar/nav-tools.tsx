"use client";

import { LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar.tsx";
import Link from "next/link";

interface ToolItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export function NavTools({
  toolsItems,
}: {
  toolsItems: ToolItem[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-primary-foreground">Herramientas</SidebarGroupLabel>
      <SidebarMenu>
        {toolsItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
