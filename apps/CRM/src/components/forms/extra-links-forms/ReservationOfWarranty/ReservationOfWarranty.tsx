"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { format } from "date-fns";
import { DatePicker } from "../../inputs/DatePicker";
import { CurrencyInput } from "../../inputs/CurrencyInput";
import PreviewReservationOfWarranty from "./PreviewReservationOfWarranty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";

interface FormData {
  nombreSolicitante: string;
  dni: string;
  fechaActual: string;
  domicilio: string;
  montoReserva: string;
  monedaReserva: string;
  montoGarantia: string;
  monedaGarantia: string;
  montoAlquiler: string;
  monedaAlquiler: string;
  montoExpensas: string;
  monedaExpensas: string;
  cantidadCuotas: string;
  montoCuotas: string;
  monedaCuotas: string;
  fechaVencimiento: string;
  nombreOrganizacion: string; // Nueva clave para almacenar la organización seleccionada
}

export default function ReservationOfWarranty({
  organizations,
}: {
  organizations: {
    id: number;
    type: string | null;
    logoUrl: string | null;
  }[];
}) {
  const [formData, setFormData] = useState<FormData>({
    nombreSolicitante: "",
    dni: "",
    fechaActual: "",
    domicilio: "",
    montoReserva: "",
    monedaReserva: "ARS",
    montoGarantia: "",
    monedaGarantia: "ARS",
    montoAlquiler: "",
    monedaAlquiler: "ARS",
    montoExpensas: "",
    monedaExpensas: "ARS",
    cantidadCuotas: "",
    montoCuotas: "",
    monedaCuotas: "ARS",
    fechaVencimiento: "",
    nombreOrganizacion: "Trust Fund", // Inicializado vacío
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nombreOrganizacion: value,
    }));
  };
  
  const handleCurrencyChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const isFormValid = (): boolean => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const previewRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Reserva-de-garantía-${formData.nombreSolicitante}.pdf`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-8 p-8">
      <div className="w-full md:w-auto lg:w-1/2 space-y-8">
        <h1 className="text-2xl font-bold text-primary">Reserva de Garantía</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 flex-wrap gap-4">
          {/* Select de Organizaciones */}
          <div className="space-y-2 w-full">
            <Label htmlFor="organizacion">Organización</Label>
            <Select
              onValueChange={handleSelectChange}
              value={formData.nombreOrganizacion}
            >
              <SelectTrigger className="bg-primary/30">
                <SelectValue placeholder="Selecciona una organización" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((item) => (
                  <SelectItem key={item.id} value={item.type || "N/A"}>
                    {item.type || "N/A"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="fechaActual">Fecha actual</Label>
            <DatePicker
              id="fechaActual"
              name="fechaActual"
              setDateValue={(dateValue: string) => {
                const formattedDate = format(new Date(dateValue), "dd/MM/yyyy");
                setFormData((prev) => ({
                  ...prev,
                  fechaActual: formattedDate,
                }));
              }}
              placeHolder="Fecha actual"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="nombreSolicitante">Nombre completo</Label>
            <Input
              id="nombreSolicitante"
              name="nombreSolicitante"
              value={formData.nombreSolicitante}
              onChange={handleInputChange}
              placeholder="Nombre completo"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="dni">DNI</Label>
            <Input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              placeholder="DNI"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="domicilio">Domicilio</Label>
            <Input
              id="domicilio"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleInputChange}
              placeholder="Domicilio"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="montoReserva">Valor de la Reserva</Label>
            <CurrencyInput
              id="montoReserva"
              value={formData.montoReserva}
              currency={formData.monedaReserva}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "montoReserva", value },
                } as any)
              }
              onCurrencyChange={(currency) =>
                handleCurrencyChange("monedaReserva", currency)
              }
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="montoGarantia">Valor de la Garantía</Label>
            <CurrencyInput
              id="montoGarantia"
              value={formData.montoGarantia}
              currency={formData.monedaGarantia}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "montoGarantia", value },
                } as any)
              }
              onCurrencyChange={(currency) =>
                handleCurrencyChange("monedaGarantia", currency)
              }
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="montoAlquiler">Valor del Alquiler</Label>
            <CurrencyInput
              id="montoAlquiler"
              value={formData.montoAlquiler}
              currency={formData.monedaAlquiler}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "montoAlquiler", value },
                } as any)
              }
              onCurrencyChange={(currency) =>
                handleCurrencyChange("monedaAlquiler", currency)
              }
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="montoExpensas">Valor de las Expensas</Label>
            <CurrencyInput
              id="montoExpensas"
              value={formData.montoExpensas}
              currency={formData.monedaExpensas}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "montoExpensas", value },
                } as any)
              }
              onCurrencyChange={(currency) =>
                handleCurrencyChange("monedaExpensas", currency)
              }
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="cantidadCuotas">Cantidad de Cuotas</Label>
            <Input
              type="number"
              id="cantidadCuotas"
              name="cantidadCuotas"
              value={formData.cantidadCuotas}
              onChange={handleInputChange}
              placeholder="Cantidad de cuotas"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="montoCuotas">Valor de las Cuotas</Label>
            <CurrencyInput
              id="montoCuotas"
              value={formData.montoCuotas}
              currency={formData.monedaCuotas}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "montoCuotas", value },
                } as any)
              }
              onCurrencyChange={(currency) =>
                handleCurrencyChange("monedaCuotas", currency)
              }
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
            <DatePicker
              id="fechaVencimiento"
              name="fechaVencimiento"
              setDateValue={(dateValue: string) => {
                const formattedDate = format(new Date(dateValue), "dd/MM/yyyy");
                setFormData((prev) => ({
                  ...prev,
                  fechaVencimiento: formattedDate,
                }));
              }}
              placeHolder="Fecha de vencimiento"
            />
          </div>
        </div>

        <Button
          onClick={handleGeneratePDF}
          disabled={!isFormValid()}
          className={`w-full ${isFormValid() ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          Generar PDF
        </Button>
      </div>

      <div className="w-full md:w-3/4 lg:w-1/2 space-y-8" ref={previewRef}>
        <PreviewReservationOfWarranty formData={formData} />
      </div>
    </div>
  );
}
