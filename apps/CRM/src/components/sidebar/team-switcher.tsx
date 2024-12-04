"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu.tsx";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/ui/sidebar.tsx";

import TrustFundWhite from "@assets/logoWhite.svg";
import TrustFundBlack from "@assets/logo.svg";
import OkCredIcon from "@assets/OkCredIcon.svg";
import OkCredIconRed from "@assets/OkCredRed.svg";

import { Session } from "next-auth";
import { useTheme } from "next-themes";
import Link from "next/link";

export function TeamSwitcher({
  teams,
  session,
}: {
  teams: {
    type: string;
    logo?: React.ElementType;
    logoUrl?: string | undefined;
  }[];
  session: Session;
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(
    teams[session?.user?.organization ? session?.user?.organization - 1 : 0]!
  );
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    if (
      session?.user?.organization &&
      session?.user.organization === 2 &&
      theme === "light"
    ) {
      setTheme("dark");
    } else if (
      session?.user?.organization &&
      session?.user.organization === 1 &&
      theme === "dark"
    ) {
      setTheme("light");
    } else if (!session?.user?.organization) {
      setTheme("light");
    }
  }, [session?.user?.organization]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {session?.user?.role === 3 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="hover:bg-primary hover:text-primary-foreground active:bg-primary/50"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  {activeTeam?.type === "Trust Fund" ? (
                    <img src={TrustFundWhite.src} alt="Trust Fund" />
                  ) : (
                    <img src={OkCredIcon.src} alt="Icon OkCred" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold">
                    {activeTeam?.type}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-primary">
                Organizaciones
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.type}
                  onClick={() => {
                    setActiveTeam(team);
                    team.type === "Trust Fund"
                      ? setTheme("light")
                      : setTheme("dark");
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-7 items-center justify-center rounded-sm">
                    {team.type === "Trust Fund" ? (
                      <img src={TrustFundBlack.src} alt="Trust Fund" />
                    ) : team.type === "OKcred" ? (
                      <img src={OkCredIconRed.src} alt="Icon OkCred" />
                    ) : (
                      <img src={team.logoUrl || ""} alt="Icon organization" />
                    )}
                  </div>
                  {team.type}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {session?.user?.role === 3 && (
                <DropdownMenuItem className="gap-2 p-2">
                  <Link href="/dashboard/cargar-team" className="flex gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-primary">
                      Agregar / Editar{" "}
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground active:bg-primary/50 hover:cursor-default"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              {session?.user?.organization === 1 ? (
                <img src={TrustFundWhite.src} alt="Trust Fund" />
              ) : (
                <img src={OkCredIcon.src} alt="Icon OkCred" />
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-lg font-semibold">
                {activeTeam?.type}
              </span>
            </div>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
