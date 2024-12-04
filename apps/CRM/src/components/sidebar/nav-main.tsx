"use client";

import { ChevronsUpDown, type LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@repo/ui/components/ui/collapsible.tsx";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "@repo/ui/components/ui/sidebar.tsx";
import Link from "next/link";
import { Session } from "next-auth";

type SubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SubItem[]; // If present, renders as a dropdown with sub-items
};

type NavMainProps = {
  items?: NavItem[];
  session: Session;
};

export function NavMain({ items, session }: NavMainProps) {
  // Adjust based on session user role (optional filtering)
  let filteredItems = items || [];

  if (session?.user?.role === 1) {
    filteredItems = filteredItems.filter((item) => item.title !== "Agregar responsable");
  }

  if (session?.user?.role !== 3) {
    filteredItems = filteredItems.filter((item) => item.title !== "Gestión de usuarios");
  }
 
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-primary-foreground">Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            {/* If the item has sub-items, render a dropdown */}
            {item.items ? (
              <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className="flex justify-between">
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon size={16} />}
                        <span>{item.title}</span>
                      </div>
                      <ChevronsUpDown className="h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubButton asChild key={subItem.title} className="text-primary-foreground">
                        <Link href={subItem.url} className="block">
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : (
              // Otherwise, render it as a plain navigation item
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
