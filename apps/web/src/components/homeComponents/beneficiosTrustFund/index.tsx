import React from "react";
import { motion } from "motion/react";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import flexy from "@/assets/images/flexy-1.png";
import merci from "@/assets/images/merci-1.png";
import black1 from "@/assets/images/black-1.png";
import black2 from "@/assets/images/black-2.png";
import BenefitCard from "./BenefitCard";

const config = [
  {
    img: flexy,
    title: "Bono de $10.000",
    color: "#009FBB",
    href: 'https://flexy.com.ar',
    description: (
      <>
        En el alquiler de tu próximo alojamiento a través de <span className="font-bold">Flexy.</span>
      </>
    ),
  },
  {
    img: merci,
    title: "20% OFF",
    color: "#CCCCCC",
    href: 'https://mercibroker.com.ar',
    description: (
      <>
        En tu seguro contra incendio con <span className="font-bold">Merci</span>, Broker de seguros.
      </>
    ),
  },
  {
    img: black1,
    title: "Financía honorarios",
    color: "#1A1A1A",
    href: 'https://blackwallet.com.ar',
    description: (
      <>
        En hasta 6 cuotas los costos de ingreso con <span className="font-bold">Black Wallet.</span>
      </>
    ),
  },
  {
    img: black2,
    title: "10% OFF",
    color: "#1A1A1A",
    href: 'https://blackwallet.com.ar',
    description: (
      <>
        Si usás <span className="font-bold">Black Wallet</span> y pagás tu cuota entre el 1 y 5 de cada mes.
      </>
    ),
  },
];

export default function BeneficiosTrustFund() {
  return (
    <section className="flex flex-col pb-5 pt-[5rem] px-[10%] w-full items-center md:items-start md:text-start">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full text-3xl"
      >
        <h2 className="font-bold text-5xl w-full max-md:font-medium max-md:text-1xl text-black">
          Beneficios Trust Fund
        </h2>
      </motion.div>

      <Separator orientation="horizontal" className="w-full h-1 my-5" />

      <p className="my-5 text-xl">Si sos cliente Trust Fund, obtenés los siguientes beneficios:</p>

      <div className="w-full overflow-x-auto overflow-y-visible lg:overflow-hidden h-full">
        <div className="flex lg:grid lg:grid-cols-2 grid-rows-2 gap-x-5 gap-y-10 lg:w-full w-[1200px] overflow-y-visible lg:overflow-hidden ">
          {config.map((item, index) => (
            <BenefitCard
              key={index}
              title={item.title}
              img={item.img}
              description={item.description}
              color={item.color}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
