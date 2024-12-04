"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from '@repo/ui/components/ui/button.tsx'
import { Input } from '@repo/ui/components/ui/input.tsx'
import { Textarea } from '@repo/ui/components/ui/textarea.tsx'
import { Label } from '@repo/ui/components/ui/label.tsx'
import { format } from "date-fns";
import { DatePicker } from '../../inputs/DatePicker';
import { CurrencyInput } from "../../inputs/CurrencyInput";
import ReceiptPreview from "./ReceiptPreview";
import { Checkbox } from '@repo/ui/components/ui/checkbox.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";

interface FormData {
  nombre: string;
  dni: string;
  fechaActual: string;
  montoRecibo: string;
  monedaRecibo: string;
  cantidadCuotas: string;
  numeroCuota: string;
  modoPago: string;
  infoExtra: string;
  nombreOrganizacion: string; // Nueva clave para almacenar la organización seleccionada
}

export default function ReceiptForm({
  organizations,
}: {
  organizations: {
    id: number;
    type: string | null;
    logoUrl: string | null;
  }[];
}) {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    dni: "",
    fechaActual: "",
    montoRecibo: "",
    monedaRecibo: "ARS",
    cantidadCuotas: "",
    numeroCuota: "",
    modoPago: "",
    infoExtra: "",
    nombreOrganizacion: "Trust Fund",
  });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // Estado para el checkbox

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsCheckboxChecked(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        cantidadCuotas: "",
        numeroCuota: "",
      }));
    }
  };

  const isFormValid = (): boolean => {
    // Si el checkbox está activado, las cuotas no deben ser consideradas para la validación
    const cuotaValid = isCheckboxChecked
      ? true // Si el checkbox está activado, no validamos las cuotas
      : formData.cantidadCuotas.trim() !== "" && formData.numeroCuota.trim() !== ""; // Si no, validamos las cuotas

    // Validamos todos los campos del formulario excepto las cuotas si el checkbox está activado y excluyendo infoExtra
    return (
      Object.entries(formData).every(([key, value]) => {
        // No validamos las cuotas si el checkbox está activado
        if (key === 'cantidadCuotas' || key === 'numeroCuota') {
          return isCheckboxChecked || value.trim() !== "";
        }
        // Excluir infoExtra de la validación
        if (key === 'infoExtra') {
          return true;
        }
        return value.trim() !== "";
      }) &&
      cuotaValid
    );
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
    pdf.save(`reibo-Trustfund-${formData.nombre}.pdf`);
  };


  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nombreOrganizacion: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-8 p-8">
      <div className="w-full md:w-auto lg:w-1/2 space-y-8">
        <h1 className="text-2xl font-bold text-primary">Reserva de Garantía</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 flex-wrap gap-4">
          {/* Inputs */}
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
                setFormData((prev) => ({ ...prev, fechaActual: formattedDate }));
              }}
              placeHolder="Fecha actual"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
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
            <Label htmlFor="organizacion">Método de pago</Label>
            <Select
              onValueChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  modoPago: value,
                }))
              }

            >
              <SelectTrigger className="bg-primary/30">
                <SelectValue placeholder="Selecciona una organización" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Transferencia">Transferencia</SelectItem>
                <SelectItem value="Efectivo">Efectivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="montoRecibo">Monto del recibo</Label>
            <CurrencyInput
              id="montoRecibo"
              value={formData.montoRecibo}
              currency={formData.monedaRecibo}
              onValueChange={(value) =>
                handleCurrencyChange("montoRecibo", value)
              }
              onCurrencyChange={(currency) =>
                handleCurrencyChange("monedaRecibo", currency)
              }
            />
          </div>
          {/* Checkbox */}
          <div className="space-y-2 w-full m-auto flex items-center gap-2 justify-center h-16">
            <Label htmlFor="disableFields">Deshabilitar campos de cuotas</Label>
            <Checkbox
              id="disableFields"
              checked={isCheckboxChecked}
              onCheckedChange={handleCheckboxChange}
            >
              Deshabilitar campos de cuotas
            </Checkbox>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="numeroCuota">Número de cuota</Label>
            <Input
              type="number"
              id="numeroCuota"
               min="0"
              name="numeroCuota"
              value={formData.numeroCuota}
              onChange={handleInputChange}
              placeholder="Número de cuota"
              disabled={isCheckboxChecked} // Deshabilitar cuando el checkbox está marcado
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="cantidadCuotas">Cantidad de cuotas</Label>
            <Input
              type="number"
              id="cantidadCuotas"
              min="0"
              name="cantidadCuotas"
              value={formData.cantidadCuotas}
              onChange={handleInputChange}
              placeholder="Cantidad de cuotas"
              disabled={isCheckboxChecked} // Deshabilitar cuando el checkbox está marcado
            />
          </div>


          <div className="space-y-2 w-full">
            <Label htmlFor="infoExtra">Información extra</Label>
            <Textarea
              id="infoExtra"
              name="infoExtra"
              value={formData.infoExtra}
              onChange={handleInputChange}
              placeholder="Información adicional"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>

        </div>

        <Button
          onClick={handleGeneratePDF}
          disabled={!isFormValid()}
          className={`w-full ${isFormValid()
            ? "bg-primary hover:bg-primary/80 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Generar PDF
        </Button>
      </div>

      <div className="w-full md:w-3/4 lg:w-1/2 space-y-8" ref={previewRef}>
        <ReceiptPreview data={formData} cuotasHabilitadas={!isCheckboxChecked} />
      </div>
    </div>
  );
}
