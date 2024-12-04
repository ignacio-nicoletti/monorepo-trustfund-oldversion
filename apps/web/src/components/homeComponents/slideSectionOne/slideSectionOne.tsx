"use client";

import Slider from "react-slick";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@repo/ui/components/ui/button.tsx";
import arrow_right from "@/assets/arrowIcons/arrow-right.svg";
import CalculatorWarranty from "../calculatorWarranty/calculatorWarranty";
import PromoCode from "./promoCode";

const SlideSectionOne: React.FC = () => {
  const [openModalCalculator, setOpenModalCalculator] = useState<boolean>(false);
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 6000,
    cssEase: "linear",
    draggable: true,
    swipe: true,
    rows: 1,
    
  };

  return (
    <>
      <Slider {...settings} className="h-full w-full overflow-x-hidden flex">
        {/* Slide 1 */}
        <div className="bg-center bg-no-repeat bg-cover h-screen bg-home-bg1 w-full flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-white w-full flex flex-col px-4 sm:pl-[10%] h-full justify-center"
            >
              <p className="font-medium text-sm mb-4">Somos Trust Fund</p>
              <h1 className="text-5xl font-bold">Garantizamos</h1>
              <h1 className="text-[#A0E838] text-5xl font-bold mb-4">tu alquiler</h1>
              <p className="mb-4 w-2/3">Con mínimos requisitos. Obtené tu garantía de alquiler en tan solo 24hs.</p>
              <div className="flex gap-2 items-center">
                <Button
                  variant="default"
                  className="px-8 py-6 rounded-full bg-mainbg"
                  onClick={() => setOpenModalCalculator(true)}
                >
                  Solicitá tu garantía
                </Button>
                <Button variant="default" className="h-full p-1 bg-transparent border-2 border-white rounded-full">
                  <img alt="arrow-right" src={arrow_right.src} width={36} height={36} className="cursor-pointer" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Slide 2 */}
        <div className="bg-center bg-no-repeat bg-cover h-screen bg-home-bg2 w-full flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-white w-full flex flex-col px-4 sm:pl-[10%] h-full justify-center"
            >
              <p className="font-medium text-sm mb-4">Beneficios Trust Fund</p>
              <h1 className="text-5xl font-bold">Alojate en</h1>
              <h1 className="text-[#A0E838] text-5xl font-bold mb-4">donde quieras</h1>
              <p className="mb-4 w-1/2">Flexy te regala un descuento de $10.000 en tu próximo alquiler temporal.</p>
              <div className="flex gap-2">
                <PromoCode />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Slide 3 */}
        <div className="bg-center bg-no-repeat bg-cover h-screen bg-home-bg3 w-full flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-white w-full flex flex-col px-4 sm:pl-[10%] h-full justify-center"
            >
              <p className="font-medium text-sm mb-4">Nueva sucursal</p>
              <h1 className="text-5xl font-bold">¡Ya estamos en</h1>
              <h1 className="text-[#64E1F6] text-5xl font-bold mb-4">Mendoza!</h1>
              <p className="mb-4 w-2/3">Tu garantía de alquiler, más cerca.</p>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="p-6 rounded-full bg-mainbg"
                  onClick={() => setOpenModalCalculator(true)}
                >
                  Cotizá tu garantía
                </Button>

                <Button
                  variant="default"
                  className="h-full p-1 bg-transparent border-2 border-white rounded-full"
                  onClick={() => setOpenModalCalculator(true)}
                >
                  <img alt="arrow-right" src={arrow_right.src} width={36} height={36} className="cursor-pointer" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Slider>
      {openModalCalculator && <CalculatorWarranty onClose={() => setOpenModalCalculator(false)} />}
    </>
  );
};

export default SlideSectionOne;
