import OkCredRed from "@assets/OkCredRed.svg";
import logoDelSud from "@assets/logoDelSud.svg";
import LogoverticalTrustfund from "@assets/LogoverticalTrustfund.svg";
import firmagerente from "@assets/firmagerente.svg";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card.tsx";

interface ReceiptPreviewProps {
  data: {
    nombre: string;
    dni: string;
    fechaActual: string;
    montoRecibo: string;
    monedaRecibo: string;
    cantidadCuotas: string;
    numeroCuota: string;
    modoPago: string;
    infoExtra: string;
    nombreOrganizacion: string,
  };
  cuotasHabilitadas: boolean; // Nueva prop que controla si las cuotas se deben mostrar
}

function ReceiptPreview({ data, cuotasHabilitadas }: ReceiptPreviewProps) {

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

  return (
    <div
      id="pdf-content"
      style={{
        width: "210mm",
        height: "287mm",
        padding: "0mm",
        boxSizing: "border-box",
      }}
      className="bg-white flex flex-col items-center text-black font-sans text-sm leading-relaxed gap-1 justify-between max-w-[755px] max-h-[1087px]"
    >
      {/* Banner Superior */}
      <div className="mb-4 px-8  flex justify-between w-full mt-10">
        {/* Imagen de Banner */}
        <div>
          <img
            src={data.nombreOrganizacion === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src}
            alt="Trust Fund Logo"
            className="w-40"
          />
        </div>

        <p
          className={`text-lg font-semibold ${data.nombreOrganizacion === "Trust Fund" ? "text-[#004993]" : "text-[#E82323]"
            }`}
        >
          La garantía que <span className="font-bold">necesitás</span>
          <br />
          para vivir donde <span className="font-bold">querés.</span>
        </p>
      </div>

      {/* Contenido Principal */}
      <div className="px-8 h-full w-full max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-start">
          <h2 className={`text-2xl font-bold ${data.nombreOrganizacion === "Trust Fund" ? "text-[#004993]" : "text-[#E82323]"}`}>Recibo</h2>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-4 justify-center">
              <p className="m-auto">Fecha:</p>
              <p className={`w-32 h-9 font-medium flex items-center justify-center rounded-lg border ${data.nombreOrganizacion === "Trust Fund" ? "border-[#004993]" : "border-[#E82323]"} truncate`}>
                {data.fechaActual}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Información */}
        <Card className="bg-white text-black border-none">
          <CardHeader className={`border-b ${data.nombreOrganizacion === "Trust Fund" ? "border-[#004993]" : "border-[#E82323]"}`}  >
            <CardTitle>Información del recibo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <span className="text-sm font-semibold">Nombre y Apellido:</span>
                <p className="max-w-full break-words truncate overflow-hidden">
                  {data.nombre}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <span className="text-sm font-semibold">DNI:</span>
                  <p className="max-w-full break-words truncate overflow-hidden">
                    {data.dni
                      ? new Intl.NumberFormat("es-AR").format(parseInt(data.dni.replace(/\./g, "")) || 0)
                      : ""}
                  </p>

                </div>
                <div className="border-b pb-2">
                  <span className="text-sm font-semibold">Método de pago:</span>
                  <p className="max-w-full break-words truncate overflow-hidden">
                    {data.modoPago}
                  </p>
                </div>
              </div>

              {/* Renderizado condicional de las cuotas */}
              {cuotasHabilitadas && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-b pb-2">
                    <span className="text-sm font-semibold">Cuota N°:</span>
                    <p className="max-w-full break-words truncate overflow-hidden">
                      {data.numeroCuota} de {data.cantidadCuotas}
                    </p>
                  </div>
                  <div className="border-b pb-2">
                    <span className="text-sm font-semibold">Monto del recibo:</span>
                    <p className="max-w-full break-words truncate overflow-hidden">
                      {formatCurrency(data.montoRecibo || "0", data.monedaRecibo || "ARS")}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Información Extra */}
            <div className="space-y-2">
              <span className="text-lg font-semibold">Información extra:</span>
              <div className="border rounded-lg min-h-[100px]  max-w-full overflow-auto break-words p-2  max-h-52">
                {data.infoExtra}
              </div>
            </div>

            {/* Totales y Firma */}
            <div className="flex justify-between items-center border-t h-auto pt-4">
              <div className="w-32">
                <img src={firmagerente.src} alt="Firma" className="w-full" />
              </div>
              <p className="text-2xl font-bold max-w-full break-words">
               {formatCurrency((data.montoRecibo), data.monedaRecibo)}
              </p>

            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full mb-10">
        <div className=" w-full flex gap-8 h-20 items-center justify-around">
          <div>
            <img
              src={data.nombreOrganizacion === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src}
              alt="Trust Fund Logo"
              className="w-40"
            />
          </div>
          <div><p>Forma parte de</p></div>
          <div><img
            src={logoDelSud.src}
            alt="Trust Fund Logo"
            className="w-40"
          /></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {
            data.nombreOrganizacion === "Trust Fund" ? <>
              <p>Calle 37 N 125 e/ 117 y 188 C.P 1900 | La Plata | info@trustfund.com.ar</p>
              <p>www.trustfund.com.ar</p>
            </>
              :
              <>
                <p>Diag. 77 N 652 y Plaza Italia, La Plata. Pcia. de Buenos Aires.</p>
                <p> www.okcred.com.ar</p>
              </>
          }

        </div>
      </div>
    </div>
  );
}

export default ReceiptPreview;
