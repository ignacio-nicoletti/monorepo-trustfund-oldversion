import { Separator } from "@repo/ui/components/ui/separator.tsx";
import inquilinosImage from "@/assets/images/image1.svg";
import propietariosImage from "@/assets/images/image2.svg";
import inmobiliariasImage from "@/assets/images/image3.svg";
import { motion } from "motion/react";
import HoverCard from "./hoverCard";
import { ReactNode } from "react";

interface ImageItem {
  title: string;
  urlImage: string;
  alt: string;
  description: ReactNode;
  href: string;
}

export function ImagesProcesoAlquiler() {
  const mapImage: ImageItem[] = [
    {
      title: "Inquilinos",
      urlImage: inquilinosImage.src,
      alt: "inquilinosImage",
      description: (
        <p className="text-start px-16 text-xl">
          Somos tu mejor opción. Nuestra garantía de alquiler es <span className="font-bold">rápida, accesible, segura y sin trámites engorrosos.</span> Obtenela 100% online y en menos de 24hs
        </p>
      ),
      href: "/inquilinos"
    },
    {
      title: "Propietarios",
      urlImage: propietariosImage.src,
      alt: "propietariosImage",
      description: (
        <p className="text-start px-16 text-xl">
          Te aseguramos el <span className="font-bold">pago mensual del alquiler, expensas, servicios y el cuidado de tu propiedad.</span> Cubrimos gastos legales de un posible desalojo del inquilino.
        </p>
      ),
      href: "/propietarios"
    },
    {
      title: "Inmobiliarias",
      urlImage: inmobiliariasImage.src,
      alt: "inmobiliariasImage",
      description: (
        <p className="text-start px-16 text-xl">
          Contamos con un <span className="font-bold">protocolo de alto nivel</span>, preparado para responder ágilmente ante posibles <span className="font-bold">incumplimientos del inquilino en el contrato de alquiler.</span>
        </p>
      ),
      href: "/inmobiliarias"
    },
  ];

  return (
    <section className="flex flex-col pb-5 pt-[5rem] px-[10%] bg-[#F9FAFB] w-full items-center md:items-start md:text-start">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full"
      >
        <p className="font-bold text-5xl w-full max-md:font-medium max-md:text-1xl text-[#4d4d4d]">
          Protegemos todas las necesidades
        </p>
        <p className="font-bold text-5xl mb-10 w-full max-md:font-medium max-md:text-1xl text-[#4d4d4d]">
          en el proceso de alquiler
        </p>
      </motion.div>

      <Separator orientation="horizontal" className="bg-[#D3D5DA] w-full h-1" />

      <div className="w-full flex items-center py-5">
        <div className="flex flex-col lg:flex-row items-center justify-center max-[1600px]:justify-start gap-3 w-full overflow-x-auto">
          {mapImage.map((el: ImageItem, index) => (
            <HoverCard title={el.title} alt={el.alt} urlImage={el.urlImage} description={el.description} href={el.href} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
