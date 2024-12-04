import HoverInput from "@/components/footer/hoverInput/hoverInput";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { Banknote, Calculator, Frown, Home, Minus, Plus, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion.tsx";

const AboutRealState = () => {
  function AccordionIcon() {
    return (
      <div className="accordion-icon">
        <Plus className="h-6 w-6 transition-transform block group-data-[state=open]:hidden text-[#009FBB]" />
        <Minus className="h-6 w-6 transition-transform hidden group-data-[state=open]:block text-[#009FBB]" />
      </div>
    );
  }

  return (
    <div className="flex justify-evenly flex-col gap-4 pt-10 w-full">
      <div className="pl-40 mb-10 max-md:p-4 ">
        <p className="text-2xl">Inmobiliarias</p>
        <p className="text-5xl">Tus alquileres más seguros </p>
      </div>
      <Separator />

      <div className="flex max-md:flex-col">
        <div className="flex w-1/2 flex-col justify-start items-center gap-4 max-md:w-full max-md:p-4 max-md:justify-center">
          <div className="flex flex-col gap-2 w-2/3 max-md:w-full">
            <p className="w-2/3 font-bold max-md:w-full">
              Con años de experiencia en el sector, estamos para brindar tranquilidad y confianza en
              el mercado de alquileres.{" "}
            </p>

            <div className="flex gap-2 ">
              <p className="bg-[#0D3156] text-white rounded-full p-2">Adherí tu inmobiliaria</p>
              <HoverInput />
            </div>
          </div>
        </div>

        <div className="w-1/2 pr-40 max-md:w-full max-md:p-4">
          <Accordion
            type="multiple"
            defaultValue={["guarantee", "payment"]}
            className=" border-[#009FBB]"
          >
            <AccordionItem value="guarantee">
              <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
                <div className="flex items-center justify-between w-full">
                  <span className="text-3xl">¿Qué cubre nuestra garantía?</span>
                  <AccordionIcon />
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-[#009FBB]">
                {/* <Separator className="mb-4 bg-[#009FBB]" /> */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Home className="h-5 w-5" />
                    <p>Alquiler y expensas.</p>
                  </div>
                  <div className="flex gap-2">
                    <Zap className="h-5 w-5" />
                    <p>Servicios.</p>
                  </div>
                  <div className="flex gap-2">
                    <Frown className="h-5 w-5" />
                    <p>Daños y roturas en el inmueble.</p>
                  </div>
                  <div className="flex gap-2">
                    <Frown className="h-5 w-5" />
                    <p>Costos de desalojo ante posible usurpacion del inquilino.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment">
              <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
                <div className="flex items-center justify-between w-full">
                  <span className="text-3xl">¿Cuáles son las formas de pago?</span>
                  <AccordionIcon />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Banknote className="h-5 w-5" />
                    <p>Pago de contado.</p>
                  </div>
                  <div className="flex gap-2">
                    <Calculator className="h-5 w-5" />
                    <p>Financiacion en 3 cuotas sin interés.</p>
                  </div>
                  <div className="flex gap-2">
                    <Calculator className="h-5 w-5" />
                    <p>Financiacion en 6 cuotas sin interés.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="bg-[#17191C] flex justify-evenly gap-4 p-5 max-md:flex-wrap max-md:justify-start">
        <div className="text-white flex items-center text-4xl">
          <p className=" italic font-bold">
            #Aliados<span className="font-normal">Trust</span>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-white w-52 text-start">
            <p className="text-5xl italic font-bold">+2100</p>
            <p className="italic font-bold text-[#009FBB]">Inmobiliarias</p>
            <p className="italic font-normal">adheridas a nuestro sistema de garantias</p>
          </div>

          <div className="text-white w-40 text-start">
            <p className="text-5xl italic font-bold">15</p>
            <p className="italic font-bold text-[#009FBB]">Provincias</p>
            <p className="italic font-normal">trabajan junto a Trus Fund</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutRealState;
