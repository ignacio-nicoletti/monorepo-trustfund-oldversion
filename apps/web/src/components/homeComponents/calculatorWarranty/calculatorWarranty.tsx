"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import Image from "next/image";
import CardQuotes from "./CardsQuotes";

// Import your images here
import arrow_right from "@/assets/arrowIcons/arrow-right.svg";
import percentageIcon from "@/assets/percentage-square.svg";
import startIcon from "@/assets/star.svg";
import personIcon from "@/assets/personIcon.svg";
import fondoFooter from "@/assets/fondoFooterCalculator.svg";
import { ArrowRight, X } from "lucide-react";

interface CalculatorWarrantyProps {
  onClose: () => void;
}

const CalculatorWarranty: React.FC<CalculatorWarrantyProps> = ({ onClose }) => {
  const [optionTypes] = useState<string[]>(["Vivienda", "Comercio", "Campo"]);
  const [period] = useState<number[]>([12, 24, 36, 48, 60]);
  const [showCardsQuotes, setShowCardsQuotes] = useState<boolean>(false);
  const [showFormWarranty, setShowFormWarranty] = useState<boolean>(true);

  const [warrantyPrices, setWarrantyPrices] = useState<any>({
    cashPayment: {
      rentValue: "",
      expenses: "",
      duration: "",
      title: "20% OFF",
      anticipo: "Contado",
      quantityQuotas: "1",
    },
    threeQuotas: {
      rentValue: "",
      expenses: "",
      duration: "",
      title: "3 cuotas s/ interés",
      anticipo: "Anticipo del 30%",
      quantityQuotas: "6",
    },
    sixQuotas: {
      rentValue: "",
      expenses: "",
      duration: "",
      title: "6 cuotas",
      anticipo: "Anticipo del 15%",
      quantityQuotas: "5",
    },
  });

  const [rentValue, setRentValue] = useState<string>("");
  const [expenses, setExpenses] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        onClose(); // Close the modal when the Escape key is pressed
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);


  // Manejo del cálculo de garantías
  const handleCalculate = () => {
    if (!rentValue || !expenses || !duration) return;

    const formattedRentValue = Number(rentValue);
    const formattedExpenses = Number(expenses);
    const totalRent = (formattedRentValue + formattedExpenses) * Number(duration);
    const comision = 0.08;
    const interest = 0.48;

    const totalWarranty = Math.floor(totalRent * comision);

    const Contado = totalWarranty - 0.2;

    const MethodTresCuotas = {
      quote1: totalWarranty - 0.3,
      RestQuote: totalWarranty - 0.3 / 2,
    };
    const MethodSeisCuotas = {
      quote1: totalWarranty + 0.48 - 0.15,
      RestQuote: totalWarranty + 0.48 - 0.15 / 5,
    };

    setWarrantyPrices({
      cashPayment: {
        rentValue: "",
        expenses: "",
        duration: "",
        title: "20% OFF",
        anticipo: "Contado",
        Contado,
      },
      threeQuotas: {
        rentValue: "",
        expenses: "",
        duration: "",
        title: "3 cuotas s/ interés",
        anticipo: "Anticipo del 30%",
        quantityQuotas: "6",
        MethodTresCuotas,
      },
      sixQuotas: {
        rentValue: "",
        expenses: "",
        duration: "",
        title: "6 cuotas",
        anticipo: "Anticipo del 15%",
        MethodSeisCuotas,
      },
    });

    setShowCardsQuotes(true);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 px-[10%] py-10 overflow-y-auto"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      {showFormWarranty && (
        <div className="bg-[#ECECEC] rounded-[10px] flex flex-col gap-3 shadow-lg relative p-5 !pt-10 w-full max-w-4xl">
          <div className="flex items-center justify-between">
            <h3 id="modal-title" className="w-full text-4xl font-bold text-maincolor">
              Calculá tu garantía
            </h3>
            <p className="text-sm w-full text-[#1A1A1A] opacity-[60%]">
              Calculá al instante tu garantía y conocé las modalidades de pago que mejor se adapten a tus necesidades.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row mb-6 gap-3 justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <input
                type="number"
                placeholder="Valor de alquiler"
                className="flex-1 p-4 rounded-[10px] border-none placeholder:text-black placeholder:text-sm focus:outline-none"
                min={0}
                onChange={(event) => setRentValue(event?.target.value)}
              />
              <input
                type="number"
                placeholder="Valor de las expensas"
                className="flex-1 p-4 rounded-[10px] border-none placeholder:text-black placeholder:text-sm focus:outline-none"
                min={0}
                onChange={(event) => setExpenses(event?.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
              <Select>
                <SelectTrigger className="flex-1 bg-white rounded-[10px] p-4 h-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="shadow-none bg-white">
                  {optionTypes.map((el, index) => (
                    <SelectItem value={el} key={index}>
                      {el}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value: string) => setDuration(value)}>
                <SelectTrigger className="flex-1 bg-white rounded-[10px] p-4 h-full">
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent className="px-3 py-2 bg-white">
                  {period.map((el, index) => (
                    <SelectItem value={el.toString()} key={index}>
                      {el} Meses
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="default"
                className="p-3 h-full rounded-full text-white text-xl"
                onClick={handleCalculate}
              >
                <ArrowRight />
                <span className="md:hidden">Calcular</span>
              </Button>
            </div>
          </div>
          <div
            className="hidden md:flex justify-between w-full px-10 py-9 items-center text-white rounded-[10px] mb-6"
            style={{
              backgroundImage: `url(${fondoFooter.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <p className="text-2xl font-semibold">Solicitala en pocos pasos</p>
            <div className="relative flex justify-center">
              <ul className="flex items-center gap-8">
                <li className="flex flex-col items-center font-semibold">
                  <img src={percentageIcon.src} alt="percentageIcon" width={24} height={24} />
                  Cotizá tu garantía
                </li>
                <li className="flex flex-col items-center font-semibold">
                  <img src={personIcon.src} alt="startIcon" width={24} height={24} />
                  Validá tus datos
                </li>
                <li className="flex flex-col items-center font-semibold">
                  <img src={startIcon.src} alt="personIcon" width={24} height={24} />
                  ¡Listo!
                </li>
              </ul>
              <div className="absolute inset-0 top-8 flex items-center justify-between">
                <div className="w-full border-t bg-white" style={{ height: "2px" }}></div>
              </div>
            </div>
          </div>
          {showCardsQuotes && (
            <div className="flex flex-wrap gap-4 justify-center">
              <CardQuotes warrantyPrices={warrantyPrices.cashPayment} />
              <CardQuotes warrantyPrices={warrantyPrices.threeQuotas} />
              <CardQuotes warrantyPrices={warrantyPrices.sixQuotas} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorWarranty;
