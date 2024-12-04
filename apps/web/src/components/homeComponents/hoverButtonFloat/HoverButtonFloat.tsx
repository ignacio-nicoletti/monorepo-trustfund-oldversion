"use client";

import cotizaIcon from "@/assets/cotizaIcon.svg";
import "./turn.css";
import { Button } from "@repo/ui/components/ui/button.tsx";

export default function HoverButtonFloat() {
  return (
    <div className="hidden sm:flex right-0 bottom-28 fixed z-50">
      <div className="card-container w-40 h-14">
        <div className={`card`}>
          {/* Cara frontal */}
          <div className={`card-face front`}>
            <Button className="bg-maincolor rounded-full flex items-center p-1 pr-3 text-white gap-1">
              <div className="cursor-pointer border-2 rounded-full p-1 m-1">
                <img alt="cotizaIcon" src={cotizaIcon.src} width={20} height={20} className="cursor-pointer" />
              </div>
              <p>Cotiza gratis</p>
            </Button>
          </div>
          {/* Cara trasera */}
          <div className={`card-face back`}>
            <Button className="bg-maincolor rounded-full flex items-center p-1 pr-3 text-white gap-1">
              <div className="cursor-pointer border-2 rounded-full p-1 m-1">
                <img alt="cotizaIcon" src={cotizaIcon.src} width={20} height={20} />
              </div>
              <p>Tu garantía</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
