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
import PreviewEstimateDirectForm from "./EstimateDirectPreview";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";
import { Calculator } from "./calculator";

interface FormData {
  pdf: { type: string; organization: string };
  estimate: {
    percentage: number;
    type: string;
    asesor: string;
    fechaActual: string;
  };
  cliente: {
    name: string;
    lastname: string;
    nacionality: string;
    dni: string;
    phone: string;
    email: string;
  };
  propiedad: {
    province: string;
    city: string;
    postal_code: string;
    type: string;
    uso: string;
    dimension: string;
  };
  percentages: {
    typePaid: string; //contado cuotas
    currencyWarranty: string; //pesos o dolares
    alquiler: number;
    currencyAlquiler: string;
    expensas: number;
    currencyExpensas: string;
    period: number;
    descContado: number | null;
    anticipo3Cuotas: number | null;
    anticipo6Cuotas: number | null;
    anticipoContado: number | null;
    dolarPrice: number;
    inmoDesc: number | null;
  };
  seguro: {
    cuota: number;
  };
  quotesTotal: any;
}

export default function EstimateDirectForm({ organizations }: any) {
  const [formData, setFormData] = useState<FormData>({
    pdf: { type: "directa", organization: "" }, //tipo de pdf
    estimate: {
      percentage: 0.08,
      type: "vivienda",
      asesor: "",
      fechaActual: "",
    },
    cliente: {
      name: "",
      lastname: "",
      nacionality: "",
      dni: "",
      phone: "",
      email: "",
    },
    propiedad: {
      province: "",
      city: "",
      postal_code: "",
      type: "",
      uso: "",
      dimension: "",
    },
    percentages: {
      typePaid: "contado", //contado / cuotas
      currencyWarranty: "$", //pesos o dolares
      alquiler: 0,
      currencyAlquiler: "ARS",
      expensas: 0,
      currencyExpensas: "ARS",
      period: 0,

      descContado: null,
      anticipo3Cuotas: null,
      anticipo6Cuotas: null,
      inmoDesc: null,
      anticipoContado: null,
      dolarPrice: 0,
    },
    seguro: {
      cuota: 0,
    },
    quotesTotal: {},
  });

  const optionPercentage = [
    { value: 0.04, label: "4% (Básica)" },
    { value: 0.06, label: "6% (Intermedia)" },
    { value: 0.08, label: "8% (Completa)" },
  ];

  const optionTypePdf = [
    { value: "directa", label: "Directa" },
    { value: "inmobiliaria", label: "Inmobiliaria" },
  ];

  // Cambio el tipo de pdf y organizacion
  const handleTypePdfChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pdf: {
        ...prev.pdf,
        [name]: value,
      },
    }));
  };

  // Cambio los campos del estimate
  const handleEstimatePercentageChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      estimate: {
        ...prev.estimate,
        [name]: value,
      },
    }));
  };

  // Cambio los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, key] = name.split(".");

    setFormData((prev) => ({
      ...prev,
      [section as keyof FormData]: {
        // Confirmamos que 'section' es una clave válida de 'FormData'
        ...prev[section as keyof FormData], // Mantenemos el resto de los valores en esa sección
        [key as string | number]: value, // Confirmamos que 'key' es un string válido (ya que es parte del 'name')
      },
    }));
  };

  // Cambio los campos del percentage
  const handlePercentageInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      percentages: {
        ...prev.percentages,
        [name]: value,
      },
    }));
  };

  const isFormValid = (): boolean => {
    if (Number(formData.percentages.alquiler) <= 0 || Number(formData.percentages.period) <= 0) {
      return true;
    }
    if (
      (formData.percentages.currencyAlquiler === "USD" ||
        formData.percentages.currencyExpensas === "USD" ||
        formData.percentages.currencyWarranty === "USD") &&
      Number(formData.percentages.dolarPrice) <= 0
    ) {
      return true;
    } else {
      return false;
    }
    // return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleCalculateEstimate = () => {
    const quotas = Calculator(formData);
    setFormData(quotas);
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
    pdf.save(`cotizacion-${formData.pdf.type}-${formData.cliente.name}${formData.cliente.lastname}.pdf`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-8 ">
      <div className="w-full md:w-[40%] lg:w-[40%] space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-primary">Seleccionar Organización</Label>
          <Select
            onValueChange={(value) => handleTypePdfChange("organization", value)}
            value={formData.pdf.organization}
          >
            <SelectTrigger id="organizationSelect" className="w-full">
              <SelectValue placeholder="Selecciona una organización" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org: any) => (
                <SelectItem key={org.id} value={org.type}>
                  {org.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="montoRecibo">Seleccion tipo de cotizacion</Label>
          <Select
            onValueChange={(value) => handleTypePdfChange("type", value)}
            value={formData.pdf.type}
          >
            <SelectTrigger id="percentage" className="w-full bg-primary/15">
              <SelectValue>
                {optionTypePdf.find((el) => el.value === formData.pdf.type)?.label ||
                  "Selecciona una opción"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {optionTypePdf.map((el) => (
                <SelectItem key={el.value} value={el.value}>
                  {el.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h1 className="text-2xl font-bold text-primary">Cotizacion Directa</h1>
        <div>
          <p className="text-2xl font-semibold text-primary">Asesor</p>
          <Separator className="mb-4 bg-primary" />

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 flex-wrap gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="montoRecibo">Tipo de cobertura</Label>
              <Select
                onValueChange={(value) => handleEstimatePercentageChange("percentage", value)}
                value={String(formData.estimate.percentage)} // Convierte el valor numérico a string para el Select
              >
                <SelectTrigger id="percentage" className="w-full bg-primary/15">
                  <SelectValue>
                    {
                      optionPercentage.find((el) => el.value === formData?.estimate?.percentage)
                        ?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {optionPercentage.map((el) => (
                    <SelectItem key={el.value} value={String(el.value)}>
                      {el.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="type">Tipo de propiedad</Label>
              <Select
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    estimate: {
                      ...prev.estimate,
                      type: value, // Actualiza el campo 'type' de 'propiedad'
                    },
                  }));
                }}
                value={formData.estimate.type} // Establece el valor actual de 'type'
              >
                <SelectTrigger id="type" className="w-full bg-primary/15">
                  <SelectValue>{formData.estimate.type || "Seleccione tipo"}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="vivienda">Vivienda</SelectItem>
                  <SelectItem value="comercio">Comercio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="estimate.asesor">Asesor</Label>
              <Input
                id="estimate.asesor"
                name="estimate.asesor"
                value={formData.estimate.asesor}
                onChange={handleInputChange}
                placeholder="Asesor"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="estimate.fechaActual">Fecha actual</Label>
              <DatePicker
                id="estimate.fechaActual"
                name="estimate.fechaActual"
                setDateValue={(dateValue: string) => {
                  const formattedDate = format(new Date(dateValue), "d/MM/yyyy");
                  setFormData((prev) => ({
                    ...prev,
                    estimate: {
                      ...prev.estimate,
                      fechaActual: formattedDate,
                    },
                  }));
                }}
                placeHolder="Fecha actual"
              />
            </div>
          </div>

          <p className="text-2xl font-semibold text-primary pt-10">Cliente</p>
          <Separator className="mb-4 bg-primary" />

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 flex-wrap gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="cliente.name">Nombre</Label>
              <Input
                id="cliente.name"
                name="cliente.name"
                value={formData.cliente.name}
                onChange={handleInputChange}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="cliente.lastname">Apellido</Label>
              <Input
                id="cliente.lastname"
                name="cliente.lastname"
                value={formData.cliente.lastname}
                onChange={handleInputChange}
                placeholder="Apellido completo"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="cliente.nacionality">Nacionalidad</Label>
              <Input
                id="cliente.nacionality"
                name="cliente.nacionality"
                value={formData.cliente.nacionality}
                onChange={handleInputChange}
                placeholder="Nacionalidad"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="cliente.DNI">DNI</Label>
              <Input
                id="cliente.dni"
                name="cliente.dni"
                value={formData.cliente.dni}
                onChange={handleInputChange}
                placeholder="DNI"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="cliente.phone">Telefono</Label>
              <Input
                id="cliente.phone"
                name="cliente.phone"
                value={formData.cliente.phone}
                onChange={handleInputChange}
                placeholder="Telefono"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="cliente.email">Email</Label>
              <Input
                type="string"
                id="cliente.email"
                name="cliente.email"
                value={formData.cliente.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
          </div>

          <p className="text-2xl font-semibold text-primary pt-10">Propiedad</p>
          <Separator className="mb-4 bg-primary" />

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 flex-wrap gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="propiedad.province">Provincia</Label>
              <Input
                id="propiedad.province"
                name="propiedad.province" // Prefijo para identificar la sección
                value={formData.propiedad.province}
                onChange={handleInputChange}
                placeholder="Provincia"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="propiedad.city">Ciudad</Label>
              <Input
                id="propiedad.city"
                name="propiedad.city"
                value={formData.propiedad.city}
                onChange={handleInputChange}
                placeholder="Ciudad"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="propiedad.postal_code">Código Postal</Label>
              <Input
                id="propiedad.postal_code"
                name="propiedad.postal_code"
                value={formData.propiedad.postal_code}
                onChange={handleInputChange}
                placeholder="Código Postal"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="propiedad.type">Tipo de Propiedad</Label>
              <Input
                id="propiedad.type"
                name="propiedad.type"
                value={formData.propiedad.type}
                onChange={handleInputChange}
                placeholder="Tipo de Propiedad"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="propiedad.uso">Uso de la Propiedad</Label>
              <Input
                id="propiedad.uso"
                name="propiedad.uso"
                value={formData.propiedad.uso}
                onChange={handleInputChange}
                placeholder="Uso de la Propiedad"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="propiedad.dimension">Metros cuadrados</Label>
              <Input
                id="propiedad.dimension"
                name="propiedad.dimension"
                value={formData.propiedad.dimension}
                onChange={handleInputChange}
                placeholder="Metros cuadrados"
              />
            </div>
          </div>

          <p className="text-2xl font-semibold text-primary pt-10">Porcentajes</p>
          <Separator className="mb-4 bg-primary" />

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 flex-wrap gap-4">
            {/*(Contado / Cuotas) */}
            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.currencyAlquiler">Alquiler</Label>
              <CurrencyInput
                id="percentages.currencyAlquiler"
                value={String(formData.percentages.alquiler)}
                currency={formData.percentages.currencyAlquiler}
                onValueChange={(value) => handlePercentageInputChange("alquiler", value)}
                onCurrencyChange={(value) => handlePercentageInputChange("currencyAlquiler", value)}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.currencyExpensas">Expensas</Label>
              <CurrencyInput
                id="percentages.currencyExpensas"
                value={String(formData.percentages.expensas)}
                currency={formData.percentages.currencyExpensas}
                onValueChange={(value) => handlePercentageInputChange("expensas", value)}
                onCurrencyChange={(value) => handlePercentageInputChange("currencyExpensas", value)}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.period">Duracion</Label>
              <Input
                id="percentages.period"
                name="percentages.period"
                type="number"
                value={String(formData.percentages.period)}
                onChange={handleInputChange}
                placeholder="Duracion"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="montoRecibo">Forma de pago</Label>
              <Select
                onValueChange={(value) => handlePercentageInputChange("typePaid", value)} // Llama al handler de typePaid
                value={formData.percentages.typePaid}
              >
                <SelectTrigger id="percentage" className="w-full bg-primary/15">
                  <SelectValue>
                    {formData.percentages.typePaid === "contado"
                      ? "Contado"
                      : formData.percentages.typePaid === "cuotas"
                        ? "Cuotas"
                        : "Seleccionar forma de pago"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="contado">Contado</SelectItem>
                  <SelectItem value="cuotas">Cuotas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/*(Pesos / Dólares) */}
            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.currencyWarranty">Moneda de la cotizacion</Label>
              <Select
                value={formData.percentages.currencyWarranty}
                onValueChange={(value) => handlePercentageInputChange("currencyWarranty", value)}
              >
                <SelectTrigger id="percentages.currencyWarranty" className="w-full bg-primary/15">
                  <SelectValue>
                    {formData.percentages.currencyWarranty === "$"
                      ? "Pesos"
                      : formData.percentages.currencyWarranty === "USD"
                        ? "Dólares"
                        : "Selecciona una moneda"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="$">Pesos</SelectItem>
                  <SelectItem value="USD">Dólares</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.dolarPrice">Precio Dolar</Label>
              <Input
                id="percentages.dolarPrice"
                name="percentages.dolarPrice"
                type="number"
                 min="0"
                value={formData.percentages.dolarPrice}
                onChange={handleInputChange}
                placeholder="Precio dolar hoy"
                disabled={
                  formData.percentages.currencyAlquiler === "USD" ||
                    formData.percentages.currencyExpensas === "USD" ||
                    formData.percentages.currencyWarranty === "USD"
                    ? false
                    : true
                }
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.descContado">Descuento Contado (%)</Label>
              <Input
                id="percentages.descContado"
                name="percentages.descContado"
                type="number"
                 min="0"
                value={String(formData.percentages.descContado)}
                onChange={handleInputChange}
                placeholder="Descuento contado"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.anticipo3Cuotas">Anticipo 3 cuotas (%)</Label>
              <Input
                id="percentages.anticipo3Cuotas"
                name="percentages.anticipo3Cuotas"
                type="number"
                 min="0"
                value={String(formData.percentages.anticipo3Cuotas)}
                onChange={handleInputChange}
                placeholder="Anticipo 3 cuotas"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.anticipo6Cuotas">Anticipo 6 cuotas (%)</Label>
              <Input
                id="percentages.anticipo6Cuotas"
                name="percentages.anticipo6Cuotas"
                type="number"
                 min="0"
                value={String(formData.percentages.anticipo6Cuotas)}
                onChange={handleInputChange}
                placeholder="Anticipo 6 cuotas"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.inmoDesc">Desc. inmboliaria (%)</Label>
              <Input
                id="percentages.inmoDesc"
                name="percentages.inmoDesc"
                type="number"
                min="0"
                value={String(formData.percentages.inmoDesc)}
                onChange={handleInputChange}
                placeholder="Descuento inmboliaria"
                // disabled={formData.pdf.type === "directa"}
                disabled={true}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.inmoDesc">Anticipo Contado (%)</Label>
              <Input
               min="0"
                id="percentages.inmoDesc"
                name="percentages.inmoDesc"
                type="number"
                value={String(formData.percentages.inmoDesc)}
                onChange={handleInputChange}
                placeholder="Descuento inmboliaria"
                disabled={formData.pdf.type === "directa"}
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="percentages.inmoDesc">Cuota seguro</Label>
              <Input
                id="seguro.cuota"
                name="seguro.cuota"
                type="number"
                 min="0"
                value={String(formData.seguro.cuota)}
                onChange={handleInputChange}
                placeholder="Precio seguro"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4">
          <Button
            onClick={() => handleCalculateEstimate()}
            className={`w-full ${!isFormValid() ? "bg-blue-500 hover:bg-blue-600 text-white " : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={isFormValid()}
          >
            Calcular garantia
          </Button>
          <Button
            onClick={handleGeneratePDF}
            disabled={!isFormValid()}
            className={`w-full ${isFormValid() ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Generar PDF
          </Button>
        </div>
      </div>

      <div className="flex bg-green-500" style={{
        width: "260mm",
        maxHeight: "450mm",
      }}
       ref={previewRef}>
        <PreviewEstimateDirectForm formData={formData} />
      </div>
    </div>
  );
}
