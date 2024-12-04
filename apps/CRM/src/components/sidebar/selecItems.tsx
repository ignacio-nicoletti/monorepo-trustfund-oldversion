"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible.tsx";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@repo/ui/components/ui/sidebar.tsx";
import React from "react";

// Interfaces para tipar los items
interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon; // Icono opcional de tipo LucideIcon
  isActive?: boolean;
  items?: SubMenuItem[]; // Lista de subelementos
}

interface SubMenuItem {
  title: string;
  url: string;
}

// Componente para seleccionar items
interface SelecItemsProps {
  items: MenuItem[];
}

const SelecItems: React.FC<SelecItemsProps> = ({ items }) => {
  return (
    <>
      {/* Renderiza los items y sus subItems en un menú desplegable */}
      {items.length > 0 ? (
        items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className="text-primary-foreground"
                      >
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))
      ) : (
        <span>No existen items</span>
      )}
    </>
  );
};

export default SelecItems;
