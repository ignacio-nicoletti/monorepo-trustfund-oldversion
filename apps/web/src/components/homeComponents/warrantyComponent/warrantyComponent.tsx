"use client";

import { Button } from "@repo/ui/components/ui/button.tsx";
import arrow_rightBlue from "@/assets/arrowIcons/arrow-rightBlue.svg";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { motion } from "motion/react";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@repo/ui/components/ui/accordion.tsx";
import homeIcon from "@/assets/home.svg";
import flashIcon from "@/assets/flash.svg";
import desalojoIcon from "@/assets/desalojo.svg";
import dañosIcon from "@/assets/daños.svg";

export default function WarrantyComponent() {
  return (
    <section className="flex flex-col items-center justify-center px-[10%] py-[2.5%] max-md:p-5">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full text-3xl"
      >
        <h2 className="font-bold text-5xl w-full max-md:font-medium max-md:text-1xl text-[#4d4d4d]">
          ¿Que es una garantía de alquiler?
        </h2>
      </motion.div>

      <Separator orientation="horizontal" className="bg-[#D3D5DA] w-full h-1 my-10" />

      <div className="flex w-full justify-center max-md:flex-col max-md:items-start gap-5">
        <div className="w-1/3 flex flex-col items-center max-md:w-full ">
          <div className="w-full flex flex-col items-start ">
            <p className="text-start max-md:w-full text-xl w-[25ch] font-bold">
              Seas propietario o inquilino, nuestra garantía puede brindarte la tranquilidad que necesitás
            </p>

            <div className="w-full flex gap-5 mt-4 justify-start items-start">
              <Button variant="default" className="p-6 rounded-full bg-mainbg">
                Quiero saber mas
              </Button>
              <div className="mb-2">
                <button
                  className="bg-transparent border-2 border-maincolor 
              rounded-full p-1"
                >
                  <img alt="arrow-right" src={arrow_rightBlue.src} width={36} height={36} className="cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 flex max-md:w-full h-full flex-col items-start gap-4 justify-center">
          <div className="w-full md:w-4/6">
            <p className="text-xl">
              Se trata de una garantía de fianza que cubre las obligaciones estipuladas en el contrato de locación,
              siendo el aval más completo para cuidar los intereses de todas las partes involucradas en el alquiler.
            </p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="guarantee-coverage">
                <AccordionTrigger className="text-start text-2xl font-semibold">¿Qué cubre nuestra garantía?</AccordionTrigger>
                <AccordionContent>
                  <Separator orientation="horizontal" className="bg-[#009FBB] w-full h-1 mb-4" />
                  <ul className="flex flex-col gap-5">
                    <li className="flex items-center gap-2">
                      <img
                        src={homeIcon.src}
                        alt="Alquiler y expensas"
                        width={36}
                        height={36}
                        className="cursor-pointer"
                      />
                      <b>Alquiler y expensas.</b>
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={flashIcon.src} alt="Servicios" width={36} height={36} className="cursor-pointer" />
                      <b>Servicios.</b>
                    </li>
                    <li className="flex items-center gap-2">
                      <img
                        src={desalojoIcon.src}
                        alt="Daños y roturas"
                        width={36}
                        height={36}
                        className="cursor-pointer"
                      />
                      <b>Daños y roturas en el inmueble.</b>
                    </li>
                    <li className="flex items-center gap-2">
                      <img
                        src={dañosIcon.src}
                        alt="Costos de desalojo"
                        width={36}
                        height={36}
                        className="cursor-pointer"
                      />
                      <b>Costos de desalojo ante posible usurpacion del inquilino.</b>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
