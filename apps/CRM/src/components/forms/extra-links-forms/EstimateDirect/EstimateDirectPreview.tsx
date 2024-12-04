import bannerResrvationwarranty from "@assets/bannerResrvationwarranty.svg";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import auto from "@assets/autito.svg";
import logoTrust from "@assets/logo.svg";
import logoDelSud from "@assets/delSudLogo.svg";
import qr from "@assets/qr.svg";
import qrOkCred from "@assets/qr-code-okcred.png"
import OkCredRed from "@assets/OkCredRed.svg";
// import logoDelSud from "@assets/logoDelSud.svg";
import LogoverticalTrustfund from "@assets/LogoverticalTrustfund.svg";

interface FormData {
  quotesTotal: any;
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
    period: number | null;
    descContado: number | null;
    anticipo3Cuotas: number | null;
    anticipo6Cuotas: number | null;
    dolarPrice: number;
  };
  seguro: { cuota: number };
}
interface PreviewEstimateDirectFormProps {
  formData: FormData;
}

function PreviewEstimateDirectForm({ formData }: PreviewEstimateDirectFormProps) {
  //Transformar bien la informacion del monto
  function formatCurrency(amount: string, currency: string): string {
    // Remover separadores de miles (puntos) antes de convertir
    const cleanedAmount = amount.replace(/\./g, "").replace(/,/g, ".");
    const numericAmount = parseFloat(cleanedAmount); // Convertir a número

    if (isNaN(numericAmount)) return "Monto inválido"; // Manejo de errores 

    // Determinar el código de moneda y símbolo manualmente
    const currencyMap: Record<string, string> = {
      USD: "USD", // Código oficial de USD
      ARS: "ARS", // Código oficial de ARS
    };

    const selectedCurrency = currencyMap[currency] || "ARS"; // Default a ARS si no se encuentra

    const formatter = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(numericAmount);
  }

  const dataOkCred = {
    domicilio: "Diagonal 77 N° 652 y Plaza Italia, La Plata, Bs. As.",
    email: "garantias@okcred.com.ar",
    razonSocial: "OK CRED S.A.",
    tel: "221 5544544",
    CUIT: "33-71712987-3",
    domicilioLegal: "Diagonal 77 N° 652 y Plaza Italia, La Plata, Provincia de Buenos Aires",
    representante: {
      nombre: "Francisco Alberto VILA BASUALDO",
      DNI: "36.092.449"
    }
  };

  const dataTrusFund = {
    domicilio: "Calle 37 125 La Plata, Bs. As.",
    email: "info@trustfund.com.ar",
    razonSocial: "GRUPO DELSUD ADMINISTRACIÓN FINANCIERA E INMOBILIARIA S.R.L.",
    CUIT: "30-71616529-5",
    tel: "221 3619465",
    representante: {
      nombre: "Francisco Alberto VILA BASUALDO",
      DNI: "36.092.449"
    }
  };

  return (
    <div
      className="bg-white h-full m-auto w-full py-4 flex flex-col items-center text-black font-sans text-sm leading-relaxed gap-1 justify-center p-4"
    >
      <div className="h-full w-full mt-2  mx-auto mb-4">
        <div className="mb-4">
          {/* Imagen de Banner */}
          <img
            src={
              formData.pdf.organization === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src
            }
            alt="Trust Fund Logo"
            className="w-40"
          />
        </div>
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className=" text-xl font-medium">Garantizamos tu alquiler</h1>
          <div className="flex gap-4">
            <div>Asesor: {formData.estimate.asesor}</div>
            <div>Fecha: {formData.estimate.fechaActual}</div>
          </div>
        </div>

        {/* Cliente Section */}
        <div className="w-full ">
          <div className={` ${formData.pdf.organization === "Trust Fund" ? "bg-primary" : "bg-[#E82323]"} p-2 flex justify-between items-center mb-1`}>
            <h2 className='text-lg font-bold text-white'>Cliente</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold">
                Nombres: <span className="font-normal">{formData.cliente.name}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Apellidos: <span className="font-normal">{formData.cliente.lastname}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Nacionalidad: <span className="font-normal">{formData.cliente.nacionality}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                DNI/Pasaporte: <span className="font-normal">{formData.cliente.dni}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Telefono: <span className="font-normal">{formData.cliente.phone}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Email: <span className="font-normal">{formData.cliente.email}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Propiedad Section */}
        <div className="w-full mt-4">
          <div className={` ${formData.pdf.organization === "Trust Fund" ? "bg-primary" : "bg-[#E82323]"} p-2 mb-4`}>
            <h2 className="text-lg font-bold text-white">Propiedad</h2>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label className="block text-sm font-semibold">
                Provincia: <span className="font-normal">{formData.propiedad.province}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Localidad: <span className="font-normal">{formData.propiedad.city}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                CP: <span className="font-normal">{formData.propiedad.postal_code}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Tipo de propiedad: <span className="font-normal">{formData.propiedad.type}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Uso: <span className="font-normal">{formData.propiedad.uso}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                M² totales: <span className="font-normal">{formData.propiedad.dimension}</span>
              </label>
            </div>
          </div>
          <Separator className="bg-primary" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold">
                Alquiler mensual:{" "}
                <span className="font-normal">
                  {formatCurrency(formData?.percentages?.alquiler.toString(), formData.percentages.currencyAlquiler) || null}
                </span>

              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Monto de expensas:{" "}
                <span className="font-normal">
                  {formatCurrency(formData.percentages.expensas.toString(), formData.percentages.currencyExpensas) || null}
                </span>

              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Duración: <span className="font-normal">{formData.percentages.period}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Banner garantia de Alquiler */}
        <div className="w-full  mx-auto mt-4 bg-white border rounded-lg shadow-lg">
          {/* Header */}
          <div className={` ${formData.pdf.organization === "Trust Fund" ? "bg-primary" : "bg-[#E82323]"} text-white p-4 text-lg font-semibold rounded-t-lg`}>
            Garantía de Alquiler
          </div>

          {/* Content */}
          <div className="p-6 flex justify-between items-start">
            {/* Details */}
            <div className="w-2/3">
              <p className="mb-2">Garantía de tipo seguro de fianza.</p>
              <p className="mb-4">
                Abonando de contado: Anticipo de{" "}
                <span className="font-bold">
                  {formData.percentages.currencyWarranty}{" "}
                  {formData.quotesTotal?.cashPayment?.anticipoContado &&
                    Number(formData.quotesTotal?.cashPayment?.anticipoContado).toLocaleString(
                      "es-ES"
                    )}
                </span>{" "}
                + 1 pago de{" "}
                <span className="font-bold">
                  {formData.percentages.currencyWarranty}{" "}
                  {formData.quotesTotal?.cashPayment?.cuotasContado &&
                    Number(formData.quotesTotal?.cashPayment?.cuotasContado).toLocaleString(
                      "es-ES"
                    )}
                </span>
              </p>
              {formData.percentages.typePaid === "cuotas" && (
                <div className="mb-4">
                  <p className="font-bold">Financiacion:</p>
                  <p className="">
                    3 Cuotas sin interés: Anticipo de{" "}
                    <span className="font-bold">
                      {formData.percentages.currencyWarranty}{" "}
                      {formData.quotesTotal?.threeQuotas?.anticipoThreeCuotas &&
                        Number(
                          formData.quotesTotal?.threeQuotas?.anticipoThreeCuotas
                        ).toLocaleString("es-ES")}
                    </span>{" "}
                    + 2 cuotas de{" "}
                    <span className="font-bold">
                      {formData.percentages.currencyWarranty}{" "}
                      {formData.quotesTotal?.threeQuotas?.cuotasThreeCuotas &&
                        Number(formData.quotesTotal?.threeQuotas?.cuotasThreeCuotas).toLocaleString(
                          "es-ES"
                        )}
                    </span>{" "}
                    c/u
                  </p>
                  <p className="">
                    6 Cuotas: Anticipo de{" "}
                    <span className="font-bold">
                      {formData.percentages.currencyWarranty}{" "}
                      {formData.quotesTotal?.sixQuotas?.anticipoSixCuotas &&
                        Number(formData.quotesTotal?.sixQuotas?.anticipoSixCuotas).toLocaleString(
                          "es-ES"
                        )}
                    </span>
                    + 5 cuotas de{" "}
                    <span className="font-bold">
                      {formData.percentages.currencyWarranty}{" "}
                      {formData.quotesTotal?.sixQuotas?.cuotasSixCuotas &&
                        Number(formData.quotesTotal?.sixQuotas?.cuotasSixCuotas).toLocaleString(
                          "es-ES"
                        )}{" "}
                    </span>
                    c/u
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600">
                Los valores expresados no incluyen IVA. En caso de abonar de contado, el restante
                del anticipo se abona al momento de la firma del contrato de garantía. En caso de
                requerir factura, la facturación se realizará mes a mes con el abono de las cuotas.
              </p>
            </div>

            {/* Cost */}

            {formData.percentages.descContado === null ||
              (formData.percentages.descContado === 0 &&
                formData.quotesTotal.cashPayment?.totalWithDiscount <= 0) ? (
              <div className="w-1/3 text-center border-l border-gray-200 pl-4">
                <p className="text-lg font-semibold mb-2">
                  Costo garantía:{" "}
                  {formData?.estimate?.percentage == 0.04
                    ? "Basica"
                    : formData?.estimate?.percentage == 0.06
                      ? "Intermedia"
                      : "Completa"}
                </p>
                <p className=" text-3xl font-bold">
                  {formData.percentages.currencyWarranty}{" "}
                  {formData.quotesTotal?.cashPayment?.total &&
                    Number(formData?.quotesTotal?.cashPayment?.total).toLocaleString("es-ES")}
                </p>
                <p className="text-sm text-gray-600">Valor sin IVA pagando de contado.</p>
              </div>
            ) : (
              <div className="w-1/3 text-center border-l border-gray-200 pl-4">
                <p className="text-lg font-semibold mb-2">
                  Costo garantía:{" "}
                  {formData?.estimate?.percentage == 0.04
                    ? "Básica"
                    : formData?.estimate?.percentage == 0.06
                      ? "Intermedia"
                      : "Completa"}
                </p>
                <div className="flex gap-2 justify-center text-lg font-bold ">
                  <p>Antes:{" "} </p>
                  <span className="line-through  ">
                    {formData.percentages.currencyWarranty}{" "}
                    {formData.quotesTotal?.cashPayment?.total &&
                      Number(formData?.quotesTotal?.cashPayment?.total).toLocaleString("es-ES")}
                  </span>
                </div>
                <p className=" text-lg font-bold ">
                  {" "}
                  Ahora: {formData.percentages.currencyWarranty}{" "}
                  {formData.quotesTotal?.cashPayment?.warrantyTotalWithDiscountContado &&
                    Number(
                      formData?.quotesTotal?.cashPayment?.warrantyTotalWithDiscountContado
                    ).toLocaleString("es-ES")}
                </p>
                <p className="text-sm text-gray-600">
                  Con {formData.percentages.descContado}% OFF aplicado
                </p>
                <p className="text-sm text-gray-600">Valor sin IVA pagando de contado.</p>
              </div>
            )}
          </div>
        </div>

        {/* Banner seguro de incendios */}
        <div className="w-full l mx-auto mt-4 bg-white border rounded-lg shadow-lg">
          {/* Header */}
          <div className={` ${formData.pdf.organization === "Trust Fund" ? "bg-primary" : "bg-[#E82323]"} text-white p-4 text-lg font-semibold rounded-t-lg`}>
            Seguro de Incendios - Recomendado
          </div>

          <div className="p-6 gap-1 flex justify-between items-start">
            {/* Details */}
            <div className="w-2/3">
              <p className="mb-2">
                Tipo de Póliza:{" "}
                {formData.estimate.type === "comercio"
                  ? "INTEGRAL DE COMERCIO / VIGENCIA TRIMESTRAL"
                  : "INCENDIO DE VIVIENDA CLÁSICO / VIGENCIA ANUAL"}
                .
              </p>
              <p className="mb-4">
                Riesgo:{" "}
                {formData.estimate.type === "comercio"
                  ? "COMERCIO"
                  : "CASA Y/O DEPTO EN PLANTA BAJA O PISOS ALTOS"}
              </p>
              <p className="text-sm text-gray-600">
                101 Incendio edificio $15.000.000. 202 Huracán, vendaval, ciclón o tornado
                $15.000.000. 235 Remoción de escombros edificio $750.000. 236 Gastos extras
                $750.000.
              </p>
            </div>

            {/* Cost */}
            <div className="w-1/3 text-center border-l border-gray-200 pl-4">
              <p className="text-lg font-semibold mb-2">3 cuotas de :</p>
              <p className=" text-3xl font-bold">
                {formData.percentages.currencyWarranty}{" "}
                {formData?.seguro.cuota && Number(formData?.seguro.cuota).toLocaleString("es-ES")}
              </p>
            </div>
          </div>
        </div>

        {/* Telefono de contacto */}
        <div
          id="contratación"
          className="h-14 flex w-full text-2xl justify-center items-start gap-2"
        >
          <p> Finalizá la contratación</p>
          <div className="flex justify-center items-center gap-2 ">

            <p> {formData.pdf.organization === "Trust Fund" ? dataTrusFund.tel : dataOkCred.tel}</p>
          </div>
        </div>

        {/* Cotiza tu vehiculo */}
        <div className="flex w-full">
          <div className={` ${formData.pdf.organization === "Trust Fund" ? "bg-primary" : "bg-[#E82323]"} w-full flex justify-between px-5 items-center text-center  rounded-lg text-white`}>
            <img src={auto.src} className="w-10 my-2" />
            <div className="flex items-center gap-4">
              <div>
                <p>Asegurá tu auto o moto con 20% de reintegro</p>
              </div>
              <Separator className="bg-white h-3" orientation="vertical" />
              <div>
                <p className="font-bold">¡Cotizalo gratis!</p>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div id="footer" className="mt-4">
          <div className="flex w-full">
            <div className="w-[80%] p-4">
              <div className="flex items-center justify-between mb-5">
                <img
                  src={formData.pdf.organization === "Trust Fund" ? logoTrust.src : OkCredRed.src}
                  alt={formData.pdf.organization === "Trust Fund" ? "Trust Fund Logo" : "Del Sud Logo"}
                  className={formData.pdf.organization === "Trust Fund" ? "w-10" : "w-16"}
                />

                <div>
                  <div className="m-auto">
                    {formData.pdf.organization === "Trust Fund" ? <>
                      <p>{dataTrusFund.domicilio}</p>
                      <p>{dataTrusFund.email} / www.trustfund.com.ar</p>
                    </>
                      :
                      <>
                        <p>{dataOkCred.domicilioLegal}</p>
                        <p>{dataOkCred.email} / www.OkCred.com.ar</p>
                      </>
                    }
                  </div>
                </div>
                {formData.pdf.organization === "Trust Fund" &&
                  <img src={logoDelSud.src} />
                }

              </div>

              <div>
                <p>
                  Cotización válida por 15 días a partír de la fecha de la emisión de este
                  documento. Las variaciones en el monto de alquiler mensual inicial, expensas o
                  duración del contrato de locación previstas, entre la fecha de pago del anticipo y
                  la firma de la garantía, se traducirán en la modificación del costo de la
                  garantía. En los casos en que la diferencia resultase en un incremento del costo,
                  el solicitante abonará la diferencia. Si el valor fuese menor al previsto, {formData.pdf.organization}{" "}
                  no realizará reembolso alguno. • Proveedor de seguros MERCI PRODUCTORES
                  ASESORES DE SEGUROS S.A Matrícula N°1722 • El valor de la cotización de los
                  seguros son estimativos y pueden variar a la hora de efectivizar la contratación
                  de los mismos • {formData.pdf.organization === "Trust Fund" ? dataTrusFund.razonSocial : dataOkCred.razonSocial}
                </p>
              </div>
            </div>

            <div className="w-[20%] flex flex-col pt-4  text-center ">
              <img src={formData.pdf.organization === "Trust Fund" ? qr.src : qrOkCred.src} className="w-full" />
              <p> Atención al cliente casa central</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewEstimateDirectForm;
