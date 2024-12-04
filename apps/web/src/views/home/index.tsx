"use client";

import HoverButtonFloat from "@/components/homeComponents/hoverButtonFloat/HoverButtonFloat";
import CarrouselWarrantysBlue from "@/components/homeComponents/imagesProcesoAlquiler/carrouselWarrantysBlue/CarrouselWarrantysBlue";
import { ImagesProcesoAlquiler } from "@/components/homeComponents/imagesProcesoAlquiler/ImagesProcesoAlquiler";
import InfiniteBanner from "@/components/homeComponents/infiniteCarrousel/infiniteCarrousel";
import SlideSectionOne from "@/components/homeComponents/slideSectionOne/slideSectionOne";
import WarrantyComponent from "@/components/homeComponents/warrantyComponent/warrantyComponent";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import vector2 from "@/assets/Vector2.svg";
import vector1 from "@/assets/Vector1.svg";

import { useEffect } from "react";
import BeneficiosTrustFund from "@/components/homeComponents/beneficiosTrustFund";

export default function Home() {
  return (
    <main className="flex items-center flex-col">
      <SlideSectionOne />
      <HoverButtonFloat />
      <InfiniteBanner />

      <Separator orientation="horizontal" className="bg-[#D3D5DA] w-full h-3" />

      <WarrantyComponent />
      <ImagesProcesoAlquiler />

      <div className=" w-full">
        <div className="h-[25%] w-full ">
          <div className="relative flex  item-start justify-start w-full h-28 bg-[#004993] z-10">
            <img src={vector1.src} alt="" className="h-full absolute left-[-150px] top-[25%] " />
          </div>
        </div>
        <CarrouselWarrantysBlue />
        <div className="h-[15%] w-full white">
          <div className="relative flex  item-end justify-end w-full h-28 bg-[#004993]">
            <img src={vector2.src} alt="" className="h-full absolute bottom-[-50px] right-[0]" />
          </div>
        </div>
      </div>

      <BeneficiosTrustFund />
    </main>
  );
}
