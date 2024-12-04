import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
} from "@repo/ui/components/ui/alert-dialog.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";

import { X } from "lucide-react";
import arrow_right from "@/assets/arrowIcons/arrow-right.svg";

export default function PromoCode() {
  const [code] = useState<string>("H A A 5 8 9 6 5");

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="default" className="rounded-full bg-mainbg">
            Obtené tu código
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="flex flex-col items-center bg-[#E5E6EB]">
          <AlertDialogCancel asChild>
            <Button variant={"ghost"} className="self-end text-black">
              <X />
            </Button>
          </AlertDialogCancel>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-maincolor flex items-center justify-center">
              ¡Felicitaciones!
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col text-maincolor items-center text-center gap-4">
              ¡Flexy te regala $10.000 para tu próxima escapada! Encontrá tu alojamiento ideal en
              <a href="http://www.flexy.com.ar" target="_blank" rel="noopener noreferrer">
                www.flexy.com.ar
              </a>
              y aplicá el código para disfrutar del descuento. ¡No te pierdas esta oportunidad!
              <p className="bg-white p-3 px-7 rounded-[10px]">{code}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="default" className="px-8 py-5" onClick={() => navigator.clipboard.writeText(code)}>
              Copiar código
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button variant="default" className="h-full p-1 bg-transparent border-2 border-white rounded-full">
        <img alt="arrow-right" src={arrow_right.src} className="cursor-pointer" />
      </Button>
    </>
  );
}
