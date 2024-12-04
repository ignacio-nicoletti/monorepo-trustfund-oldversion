import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { Flame, Monitor, PencilLine } from "lucide-react";

const Service = () => {
  return (
    <div className="flex justify-evenly flex-col gap-4 py-10 w-full bg-[#F2F2F2]">
      <div className="pl-40 mb-10 max-md:p-4">
        <p className="text-2xl ">Servicio integral</p>
        <p className="text-5xl">Conocé nuestros nuevos servicios </p>
      </div>
      <Separator />

      <div className="w-full flex px-40 max-md:flex-col max-md:p-4 max-md:text-center max-md:gap-10">
        <div className="flex flex-col justify-start  gap-4 w-1/2 max-md:w-full">
          <div className="flex flex-col gap-2  w-2/3 max-md:w-full">
            <p className="w-2/3 font-bold max-md:w-full">
              Sabemos lo importante que es acompañarte, es por ello que te ofrecemos un servicio
              completo para tu comodidad.{" "}
            </p>
          </div>
        </div>

        <div className="w-1/2 flex justify-center gap-4 max-md:flex-wrap max-md:w-full">
          <div className="border-8 border-[#009FBB] flex flex-col items-center justify-center w-44 text-center h-40 rounded-3xl p-4">
            <Flame className="h-14 w-14 text-[#009FBB]" />
            <p className="font-bold">Seguros Hogar incendio</p>
          </div>
          <div className="border-8 border-[#009FBB] flex flex-col items-center justify-center w-44 text-center h-40 rounded-3xl p-4">
            <PencilLine className="h-14 w-14 text-[#009FBB]" />
            <p className="font-bold ">Gestión de firma electrónica</p>
          </div>
          <div className="border-8 border-[#009FBB] flex flex-col items-center justify-center w-44 text-center h-40 rounded-3xl p-4 bg-[#009FBB]">
            <Monitor className="h-14 w-14 text-white" />
            <p className="font-bold text-white">Creacion de sitio web</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Service;
