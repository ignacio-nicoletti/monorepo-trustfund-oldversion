"use client";

import * as React from "react";

import {
  AudioWaveform,
  Receipt,
  FilePen,
  CalendarDays,
  LineChart,
  Building2,
  Calculator,
  UserRoundPlus,
  CirclePlus,
  SquarePen,
  UserSearch,
  PencilLine,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@repo/ui/components/ui/sidebar.tsx";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import TrustFundWhite from "@assets/logoWhite.svg";
import TrustFundBlack from "@assets/logo.svg";
import { NavTools } from "./nav-tools";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

function TrustLogo() {
  const [src, setSrc] = React.useState(TrustFundWhite.src);

  const handleMouseEnter = () => {
    setSrc(TrustFundBlack.src);
  };

  const handleMouseLeave = () => {
    setSrc(TrustFundWhite.src);
  };

  return (
    <img
      src={src}
      alt="Trust Fund"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

// This is sample data.
const data = {
  teams: [
    {
      type: "Trust Fund",
      logo: TrustLogo,
    },
    {
      type: "OkCred",
      logo: AudioWaveform,
    },
  ],
  navItemsMain: [
    {
      title: "Inmobiliarias / Asesores",
      url: "/dashboard/gestion-inmobiliarias",
      icon: Building2,
    },
    {
      title: "Cargar una garantía",
      url: "/dashboard/cargar-garantia",
      icon: SquarePen,
    },
    {
      title: "Gestión de usuarios",
      url: "/dashboard/gestion-usuarios",
      icon: UserSearch,
    },
    {
      title: "Agregar inmobiliaria",
      url: "/dashboard/registrar-inmobiliaria",
      icon: CirclePlus,
    },
    {
      title: "Agregar responsable",
      url: "/dashboard/registrar-usuario",
      icon: UserRoundPlus,
    },
    {
      title: "Garantías",
      url: "#",
      icon: PencilLine,
      isActive: true,
      items: [
        {
          title: "En proceso",
          url: "/dashboard/garantias/en-proceso",
        },
        {
          title: "Cerradas ganadas",
          url: "/dashboard/garantias/activas",
        },
        {
          title: "Cerradas perdidas",
          url: "/dashboard/garantias/cerradas",
        },
        {
          title: "Finalizadas",
          url: "/dashboard/garantias/finalizadas",
        },
      ],
    },
    {
      title: "Cuotas",
      url: "/dashboard/garantias/cuotas?financingType=2",
      icon: Receipt,
    },
  ],
  toolsItems: [
    {
      title: "Simulador de garantías",
      url: "/dashboard/simulador-garantia",
      icon: Calculator,
    },
  ],
  projects: [
    {
      name: "Recibos",
      url: "/dashboard/crear-recibo",
      icon: Receipt,
    },
    {
      name: "Reservas",
      url:  "/dashboard/reserva-garantia",
      icon: CalendarDays,
    },
    {
      name: "Contratos",
      url: "https://pdf.trustfund.com.ar/hgc5143f5cg1f3x5df6x6d1c34h56",
      icon: FilePen,
    },
    {
      name: "Cotización directa",
      url: "https://pdf.trustfund.com.ar/ergashberthbreterta",
      icon: LineChart,
    },
    {
      name: "Cotización inmobiliaria",
      url: "https://pdf.trustfund.com.ar/gserthserthaerghae",
      icon: Building2,
    },
  ],
};

type SidebarProps = {
  organizations: any;
  session: Session;
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar(props: SidebarProps) {
  const { data: session } = useSession();
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      {...props}
      className={`${session?.user?.organization === 1 ? "bg-primary" : "bg-okCred"} text-primary-foreground`}
    >
      <SidebarHeader>
        <TeamSwitcher teams={props.organizations} session={session!} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navItemsMain} session={session!} />
        <NavTools toolsItems={data.toolsItems} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.session.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
