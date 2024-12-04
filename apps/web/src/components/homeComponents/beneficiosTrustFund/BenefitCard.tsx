import { ArrowRight } from "lucide-react";
import { Card } from "@repo/ui/components/ui/card.tsx";
import { ReactNode } from "react";
import { StaticImageData } from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

interface props {
  img: StaticImageData;
  title: string;
  color: string;
  href: string;
  description: ReactNode;
}

export default function BenefitCard({ img, title, description, color, href }: props) {
  return (
    <Card className="flex justify-end lg:justify-center flex-col relative lg:flex-row border-0 rounded-lg w-full overflow-visible m-0.5 lg:h-full h-[400px]">
      <div
        className={`relative w-full h-[120px] lg:h-full lg:w-3/12 rounded-tl-lg rounded-tr-lg lg:rounded-tr-none lg:rounded-bl-lg z-10`}
        style={{ backgroundColor: color }}
      >
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          src={img.src}
          alt={title}
          className="absolute scale-95 lg:scale-[130%] bottom-0 right-5 lg:bottom-10 lg:right-10 z-10"
        />
      </div>

      <div className="flex flex-col w-full h-[150px] lg:w-7/12 lg:h-full justify-center items-center lg:items-start bg-[#D9D9D9]/20 lg:rounded-tr-lg lg:rounded-bl-none rounded-bl-lg rounded-br-lg px-7 py-14 gap-3">
        <h3 className="text-base lg:text-xl font-semibold text-maincolor">{title}</h3>
        <p className="text-gray-600 text-xs lg:text-sm text-center lg:text-start">{description}</p>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-2 lg:p-3 rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-colors"
          aria-label="Ver más detalles"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </Card>
  );
}
