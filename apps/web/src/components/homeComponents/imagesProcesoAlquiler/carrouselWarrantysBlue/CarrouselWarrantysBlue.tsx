"use client";

import semicirculo from "@/assets/semicirculos.svg";
import horasDeplegado from "@/assets/images/24horasdesplegado.svg";
import descuento_financiacion from "@/assets/images/decuento_financiacion.svg";
import Dnidesplegado from "@/assets/images/DNI_desplegado.svg";
import firma_electronica from "@/assets/images/firma_electronica.svg";
import { useEffect, useState } from "react";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { motion } from "motion/react";

const CarrouselWarrantysBlue: React.FC = () => {
  const [activeId, setActiveId] = useState(4);

  const handleClick = (id: number) => {
    setActiveId(id);
  };

  const images = [
    {
      src: horasDeplegado.src,
      alt: "Horas Deplegado",
      title: "Horas de Plazo",
      description: "Protege tus operaciones con un plazo de 24 horas.",
      id: 1,
    },
    {
      src: descuento_financiacion.src,
      alt: "Descuento y Financiación",
      title: "Descuento y Financiación",
      description: "Accede a descuentos exclusivos y opciones de financiación.",
      id: 2,
    },
    {
      src: Dnidesplegado.src,
      alt: "DNI Desplegado",
      title: "DNI Desplegado",
      description: "Proceso simple y rápido con verificación de DNI.",
      id: 3,
    },
    {
      src: firma_electronica.src,
      alt: "Firma Electrónica",
      title: "Firma Electrónica",
      description: "Documentos firmados digitalmente para tu comodidad.",
      id: 4,
    },
  ];

  return (
    <section className="bg-[#004993] w-full relative px-[10%] ">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full text-3xl"
      >
        <h2 className="font-bold text-5xl w-full max-md:font-medium max-md:text-1xl text-white">
          ¿Que es una garantía de alquiler?
        </h2>
      </motion.div>

      <Separator orientation="horizontal" className="bg-white w-full h-1 my-5" />

      <div className="flex flex-col lg:flex-row items-start justify-center text-white w-full lg:gap-10">
        <div className="flex flex-col gap-10 w-1/3 mb-6 max-xl:flex-col max-xl:w-full">
          <p>Rápido para el inquilino, seguro para el propietario, confiable para la inmobiliaria.</p>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-1/2 flex items-start justify-start max-xl:hidden"
          >
            <img src={semicirculo.src} alt="semicirculo" className=" mb-6" />
          </motion.div>
        </div>
        <div className="flex flex-col gap-10 w-2/3 mb-6 max-xl:flex-col max-xl:w-full">
          <p>Alquilá con tranquilidad, con Trust Fund estás protegido.</p>
          <div className="flex items-center gap-2 max-xl:w-full overflow-x-auto">
            {images.map((option) => (
              <div
                key={option.id}
                onClick={() => handleClick(option.id)}
                className={`cursor-pointer bg-image flex-shrink-0 gap-3 rounded-3xl transition-all duration-500 ease-in-out ${
                  option.id === activeId ? "lg:w-1/2 w-full h-96" : "w-14 h-96"
                }`}
                style={{
                  backgroundImage: `url(${option.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "left",
                  backgroundRepeat: "no-repeat",
                  backgroundPositionX: "3.5%",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarrouselWarrantysBlue;
