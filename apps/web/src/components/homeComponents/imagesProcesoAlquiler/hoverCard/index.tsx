"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { Card } from "@repo/ui/components/ui/card.tsx";
import arrow_right from "@/assets/arrowIcons/arrow-right.svg";
import Link from "next/link";

interface props {
  title: string;
  urlImage: string;
  alt: string;
  description: ReactNode;
  href: string;
}

export default function HoverCard(props: props) {
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(900);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full md:max-w-md mx-auto">
      {windowWidth > 425 ? (
        <Card
          className="relative overflow-hidden group cursor-pointer h-[600px] border-0 pb-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              filter: isHovered ? "blur(4px) brightness(50%)" : "none",
            }}
          >
            <img src={props.urlImage} alt={props.alt} className="w-full h-[600px] object-contain" />
          </div>

          {/* Content Overlay */}
          <div
            className={`absolute inset-0 bg-transparent text-white transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            } flex flex-col justify-end gap-[8rem]`}
          >
            {props.description}
            <div className="flex gap-2 w-full items-center justify-center p-6 mb-5">
              <Button
                variant="default"
                className="w-2/3 px-8 py-6 rounded-full text-black bg-[#F4F4F6] hover:bg-[#F4F4F6]/85"
              >
                <Link href={`${props.href}`}>Ver más</Link>
              </Button>
              <Button
                variant="default"
                className="p-1 bg-transparent border-2 border-white rounded-full hover:bg-transparent"
              >
                <img alt="arrow-right" src={arrow_right.src} width={24} height={24} className="cursor-pointer" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className="relative overflow-hidden group cursor-pointer h-[450px] border-0"
          onClick={() => setIsHovered(!isHovered)}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              filter: isHovered ? "blur(4px) brightness(50%)" : "none",
            }}
          >
            <img src={props.urlImage} alt={props.alt} className="w-full h-[450px]  object-cover" />
          </div>

          {/* Content Overlay */}
          <div
            className={`absolute inset-0 bg-transparent text-white transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            } flex flex-col justify-end gap-[2rem]`}
          >
            {props.description}
            <div className="flex gap-2 w-full items-center justify-center p-6 mb-2">
              <Button
                variant="default"
                className="w-2/3 px-8 py-6 rounded-full text-black bg-[#F4F4F6] hover:bg-[#F4F4F6]/85"
              >
                <Link href={`${props.href}`}>Ver más</Link>
              </Button>
              <Button
                variant="default"
                className="p-1 bg-transparent border-2 border-white rounded-full hover:bg-transparent"
              >
                <img alt="arrow-right" src={arrow_right.src} width={24} height={24} className="cursor-pointer" />
              </Button>
            </div>
          </div>
        </Card>
      )}
      <p className="border-t border-black/20 pt-5 font-[500]">{props.title}</p>
    </div>
  );
}
