import React from "react";
import TenantPrincipal from "@/assets/vectorTenant.svg";
import arrow_right from "@/assets/arrowIcons/arrow-right.svg";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { Home, Plane, FileText, CreditCard } from "lucide-react";
import HeaderImage from "@/components/reused/HeaderImage/headerImage";

import Clock from "@/assets/sectionTenant/clock.svg";
import Monitor from "@/assets/sectionTenant/monitor.svg";
import UserSquare2 from "@/assets/sectionTenant/personalcard.svg";
import Badge from "@/assets/sectionTenant/discount-shape.svg";

function TenantView() {
  const guarantees = [
    {
      icon: Home,
      title: "Garantías",
      subtitle: "residenciales",
    },
    {
      icon: Plane,
      title: "Garantías para",
      subtitle: "extranjeros",
    },
    {
      icon: FileText,
      title: "Garantías para",
      subtitle: "emprendedor",
    },
    {
      icon: CreditCard,
      title: "Garantías para",
      subtitle: "Pymes",
    },
  ];
  
  const dataTenant = {
    sectiontitle: "Inquilino",
    subtitle: "Garantizá tu tranquilidad",
    buttonText: "Escribinos",
    ArrayOptions: [
      {
        icon: Clock.src,
        text: "Obtené tu garantía en menos de 24hs",
      },
      {
        icon: Monitor.src,
        text: "Gestión 100% online",
      },
      {
        icon: UserSquare2.src,
        text: "Mínimos requisitos solo con tu DNI.",
      },
      {
        icon: Badge.src,
        text: "Descuentos ",
      },
    ],
  };

  return (
    <main className="overflow-x-hidden bg-slate-600">
      {/* Background Section */}
      <HeaderImage data={dataTenant} />;{/* Additional Sections */}
      <div className=" w-full flex justify-center bg-[#009FBB] py-14"></div>
      <div className="w-full bg-red-700">
        <h1>seccion 3</h1>
      </div>
      <div className=" flex justify-around mx-auto w-3/4 py-14 bg-[#16222E]">
        <h2 className="text-3xl font-medium text-white mb-10">¿Qué garantías ofrecemos?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 bg-slate-6003/4">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="mb-4">
                <guarantee.icon className="w-12 h-12 text-[#00B5E2]" strokeWidth={1.5} />
              </div>
              <div className="text-white space-y-1">
                <p className="text-sm">{guarantee.title}</p>
                <p className="text-sm">{guarantee.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1>seccion 5</h1>
      </div>
    </main>
  );
}

export default TenantView;
