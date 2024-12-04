"use client";

import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from '@repo/ui/components/ui/button.tsx'
import { Input } from '@repo/ui/components/ui/input.tsx'
import { Textarea } from '@repo/ui/components/ui/textarea.tsx'
import { Label } from '@repo/ui/components/ui/label.tsx'
import { format } from "date-fns";
import { DatePicker } from '../../inputs/DatePicker';
import { CurrencyInput } from "../../inputs/CurrencyInput";
import ContractPreview from "./ContractPreview";
import { Checkbox } from '@repo/ui/components/ui/checkbox.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx";
import OkCredRed from "@assets/OkCredRed.svg";
import LogoverticalTrustfund from "@assets/LogoverticalTrustfund.svg";


interface FormData {
  //Datos del contrato
  nombreOrganizacion: string;
  nameApplicant: string;
  dni: string;
  contractType: "Comercio" | "Vivienda" | null;
  cantQuotas: string;
  numQuota: number;
  cantCogarante: string;
  numContract: number;
  dateCurrent: string;
  coverageType: "Básica" | "Intermedia" | "Completa" | null;
  //Datos Personales
  addressTenant: string;
  email: string;
  addressRent: string;
  warrantyAmount: string;
  percentageQuota: string;
  expirationMonth: string;
  cantMonths: string;
  amountOfRent: number;
  amountOfRentString: string;
  expense: number;
  expenseCurrency: string;
  dateSignature: string
  ifCounted:boolean | null;
}

export default function ContractForm({
  organizations,
}: {
  organizations: {
    id: number;
    type: string | null;
    logoUrl: string | null;
  }[];
}) {
  const [formData, setFormData] = useState<FormData>({
    nombreOrganizacion: "Trust Fund",
    nameApplicant: "",
    dni: "",
    contractType: null,
    coverageType: null,
    cantQuotas: "",
    numQuota: 0,
    cantCogarante: "",
    numContract: 0,
    dateCurrent: "",
    addressTenant: "",
    email: "",
    addressRent: "",
    warrantyAmount: "",
    percentageQuota: "",
    expirationMonth: "",
    cantMonths: "",
    amountOfRent: 0,
    amountOfRentString: "",
    expense: 0,
    expenseCurrency: "",
    dateSignature: "",
    ifCounted: null
  });
  //funcion para vaciar el formulario
  const handleResetForm = () => {
    setFormData({
      nombreOrganizacion: "Trust Fund",
      nameApplicant: "",
      dni: "",
      contractType: null,
      cantQuotas: "",
      numQuota: 0,
      cantCogarante: "",
      numContract: 0,
      dateCurrent: "",
      addressTenant: "",
      email: "",
      addressRent: "",
      warrantyAmount: "",
      percentageQuota: "",
      expirationMonth: "",
      cantMonths: "",
      amountOfRent: 0,
      amountOfRentString: "",
      expense: 0,
      expenseCurrency: "",
      dateSignature: "",
      coverageType: null,
      ifCounted: null,
    });
  };

  const [isValid, setIsValid] = useState(false); // Estado para el valor booleano, para saber que tipo de contrato mostrar
 

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleCurrencyChange = (name: string, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };


  // Función para manejar el cambio del checkbox y actualizar el formulario
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      ifCounted: checked, // Actualiza 'ifCounted' en formData
    }));
  };
  useEffect(() => {
    if (
      formData.cantCogarante != "" &&
      formData.contractType != null

    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [formData])
  console.log(isValid, 'mostrar contrarto?')
  // const isFormValid = (): boolean => {
  //   // Si el checkbox está activado, las cuotas no deben ser consideradas para la validación
  //   const cuotaValid = isCheckboxChecked
  //     ? true // Si el checkbox está activado, no validamos las cuotas
  //     : formData.cantidadCuotas.trim() !== "" && formData.numeroCuota.trim() !== ""; // Si no, validamos las cuotas

  //   // Validamos todos los campos del formulario excepto las cuotas si el checkbox está activado y excluyendo infoExtra
  //   return (
  //     Object.entries(formData).every(([key, value]) => {
  //       // No validamos las cuotas si el checkbox está activado
  //       if (key === 'cantidadCuotas' || key === 'numeroCuota') {
  //         return isCheckboxChecked || value.trim() !== "";
  //       }
  //       // Excluir infoExtra de la validación
  //       if (key === 'infoExtra') {
  //         return true;
  //       }
  //       return value.trim() !== "";
  //     }) &&
  //     cuotaValid
  //   );
  // };


  const previewRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`reibo-Trustfund-${formData.nameApplicant}.pdf`);
  };


  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nombreOrganizacion: value,
    }));
  };

  const cogarantesValue = ["Sin cogarantes", "1", '2'];
  const coverageType = ["Básica", "Intermedia", "Completa"]
  console.log(formData, 'formulario')
  return (
    <div className="flex flex-col md:flex-row min-h-screen h-full w-full gap-8 p-8 ">
      <div className="w-full md:w-auto lg:w-1/2 space-y-8">
        <h1 className="text-2xl font-bold text-primary">Reserva de Garantía</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 flex-wrap gap-4">
          {/* Inputs */}
          <div className="space-y-2 w-full">
            <Label htmlFor="organizacion">Organización *</Label>
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
            <Label htmlFor="organizacion">Tipo de la garantía *</Label>
            <Select
              onValueChange={(value:"Básica" | "Intermedia" | "Completa") =>
                setFormData((prev) => ({
                  ...prev,
                  coverageType: value,
                }))
              }
              value={formData.coverageType === null ? "" : formData.coverageType}
            >
              <SelectTrigger className="bg-primary/30">
                <SelectValue
                  placeholder={
                    formData.coverageType === null
                      ? "Tipo de contrato"
                      : formData.coverageType
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {
                  coverageType.map((item, index)=>{
                    return(
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                    )
                  })
                }
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="organizacion">Cantidad de cogarantes *</Label>
            <Select

              value={formData.cantCogarante}
              onValueChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  cantCogarante: value,
                }))
              }
            >
              <SelectTrigger className="bg-primary/30">
                <SelectValue placeholder="Selecciona cogarantes" />
              </SelectTrigger>
              <SelectContent>
                {cogarantesValue.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item || "cogarantes"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="contractType">Tipo de contrato *</Label>
            <Select
              onValueChange={(value: "Comercio" | "Vivienda") =>
                setFormData((prev) => ({
                  ...prev,
                  contractType: value,
                }))
              }
              value={formData.contractType === null ? "" : formData.contractType}
            >
              <SelectTrigger className="bg-primary/30">
                <SelectValue
                  placeholder={
                    formData.contractType === null
                      ? "Tipo de contrato"
                      : formData.contractType
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vivienda">Vivienda</SelectItem>
                <SelectItem value="Comercio">Comercio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Checkbox contado o cuotas*/}
          <div className="space-y-2 w-full m-auto flex items-center gap-2 justify-center h-16">
            <Label htmlFor="ifCounted">Marque si es de contado *</Label>
            <Checkbox
              id="ifCounted"
              onCheckedChange={handleCheckboxChange}
            >
              Deshabilitar campos de cuotas
            </Checkbox>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="fechaActual">Fecha actual</Label>
            <DatePicker
              id="fechaActual"
              name="fechaActual"
              setDateValue={(dateValue: string) => {
                const formattedDate = format(new Date(dateValue), "dd/MM/yyyy");
                setFormData((prev) => ({ ...prev, dateCurrent: formattedDate }));
              }}
              placeHolder="Fecha actual"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="numContract">Nro. Contrato</Label>
            <Input
              type="number"
              id="numContract"
              name="numContract"
              value={formData.numContract}
              onChange={handleInputChange}
              placeholder="Nro. Contrato"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="nombre">Nombre completo del solicitante</Label>
            <Input
              id="nombre"
              name="nameApplicant" // Aquí corregimos el name
              value={formData.nameApplicant} // Asegúrate de que el valor venga del estado correcto
              onChange={handleInputChange} // Reutilizamos la función genérica
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
            <Label htmlFor="addressTenant">Domicilio Locatario</Label>
            <Input
              id="addressTenant"
              name="addressTenant"
              value={formData.addressTenant}
              onChange={handleInputChange}
              placeholder="Domicilio Locatario"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@example.com"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="addressRent">Calle Inmueble</Label>
            <Input
              id="addressRent"
              name="addressRent"
              value={formData.addressRent}
              onChange={handleInputChange}
              placeholder="calle inmueble"

            />
          </div>


          <div className="space-y-2 w-full">
            <Label htmlFor="infoExtra">Monto de la garantía</Label>
            <Input
              id="infoExtra"
              name="infoExtra"
              value={formData.warrantyAmount}
              onChange={handleInputChange}
              placeholder="Monto de la garantía"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="percentageQuota">Porcentaje 1er Cuota</Label>
            <Input
              id="percentageQuota"
              name="percentageQuota"
              value={formData.percentageQuota}
              onChange={handleInputChange}
              placeholder="%0"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="infoExtra">Mes Vencimiento 1er Cuota</Label>
            <Input
              id="infoExtra"
              name="infoExtra"
              value={formData.expirationMonth}
              onChange={handleInputChange}
              placeholder="Información adicional"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="cantQuotas">Cantidad Meses Vigencia</Label>
            <Input
              disabled={!formData.ifCounted === null ? false : true}
              id="cantQuotas"
              name="cantQuotas"
              value={formData.cantQuotas}
              onChange={handleInputChange}
              placeholder="1..12"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="Alquiler">Monto del alquiler</Label>
            <Input
              type="number"
              id="Alquiler"
              name="Alquiler"
              value={formData.amountOfRent}
              onChange={handleInputChange}
              placeholder="Monto de alquiler"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="AlquilerString">Monto del Alquiler (letras)</Label>
            <Input
              id="AlquilerString"
              name="AlquilerString"
              value={formData.amountOfRent}
              onChange={handleInputChange}
              placeholder="Monto del Alquiler (letras)"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="AlquilerString">Monto de expensas</Label>
            <Input
              id="Expensas"
              name="Expensas"
              value={formData.expense}
              onChange={handleInputChange}
              placeholder="Monto de Expensas"
              className="bg-primary/15 border border-primary/30 text-black"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="fechaActual">Fecha de la firma</Label>
            <DatePicker
              id="fechaFirma"
              name="fechaFirma"
              setDateValue={(dateValue: string) => {
                const formattedDate = format(new Date(dateValue), "dd/MM/yyyy");
                setFormData((prev) => ({ ...prev, dateSignature: formattedDate }));
              }}
              placeHolder="Fecha de la firma"
            />
          </div>
        </div>
        <Button
          onClick={handleResetForm}
          className="w-full bg-primary hover:bg-primary/30 text-white"
        >
          Resetear el formulario
        </Button>
        {/* <Button
          onClick={handleGeneratePDF}
          disabled={!isFormValid()}
          className={`w-full ${isFormValid()
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Generar PDF
        </Button> */}
      </div>

      <div className="w-full md:w-3/4 lg:w-1/2 space-y-8 flex" ref={previewRef}>
        {
          !isValid ?
            <div className="flex flex-col w-full h-1/2 items-center justify-between border rounded-lg mt-40">
              <img
                src={formData.nombreOrganizacion === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src}
                alt="Trust Fund Logo"
                className="w-[450px] m-auto "
              />
              <h4 className="text-sm font-semibold">Carga el formulario para crear un nuevo contrato y, posteriormente, podrás descargarlo en formato PDF.</h4>
            </div>
            : <ContractPreview data={formData} />
        }

      </div>
    </div>
  );
}
