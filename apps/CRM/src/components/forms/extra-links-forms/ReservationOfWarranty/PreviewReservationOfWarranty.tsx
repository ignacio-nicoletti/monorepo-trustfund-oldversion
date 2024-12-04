import LogoverticalTrustfund from "@assets/LogoverticalTrustfund.svg";
import firmagerente from "@assets/firmagerente.svg";
import OkCredRed from "@assets/OkCredRed.svg";
import logoDelSud from "@assets/logoDelSud.svg";
interface PreviewComponentProps {
  formData: {
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
    nombreOrganizacion: string,
  };
}

function PreviewReservationOfWarranty({ formData }: PreviewComponentProps) {
  //Funcion para formatear el monto
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

  console.log(formData.monedaReserva);

  return (
    <div
      id="pdf-content"
      style={{
        width: "200mm", // Ancho de A4
        height: "287mm", // Alto de A4
        padding: "0mm", // Márgenes en mm
        boxSizing: "border-box", // Garantiza que el padding no afecte el tamaño total
      }}
      className="bg-white flex items-center flex-col gap-1 text-black font-sans text-sm leading-relaxed justify-between"
    >
      <div className="mb-4 px-8  flex justify-between w-full mt-10">
        {/* Imagen de Banner */}
        <img
          src={formData.nombreOrganizacion === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src}
          alt="Trust Fund Logo"
          className="w-40"
        />
        <p
          className={`text-lg font-semibold ${formData.nombreOrganizacion === "Trust Fund" ? "text-[#004993]" : "text-[#E82323]"
            }`}
        >
          La garantía que <span className="font-bold">necesitás</span>
          <br />
          para vivir donde <span className="font-bold">querés.</span>
        </p>
      </div>

      <div className="px-8 h-auto">
        <div className="flex justify-between items-start mb-4">
          <h2
            className={`text-2xl font-bold ${formData.nombreOrganizacion === "Trust Fund" ? "text-[#004993]" : "text-[#E82323]"
              }`}
          >Reserva de Garantía</h2>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-4">
              <p>Fecha:</p>
              <p
                className={`w-32 h-9 font-medium flex items-center justify-center rounded-lg border ${formData.nombreOrganizacion === "Trust Fund" ? "border-[#004993]" : "border-[#E82323]"
                  }`}
              >
                {formData.fechaActual}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 text-sm">
          {/* Cláusulas */}
          <p>
            Recibí de {formData.nombreSolicitante}, DNI {formData.dni
              ? new Intl.NumberFormat("es-AR").format(parseInt(formData.dni.replace(/\./g, "")) || 0)
              : ""}, domicilio principal en{" "}
            {formData.domicilio}, la cantidad de{" "}
            {formatCurrency(formData.montoReserva || "0", formData.monedaReserva)}{" "}
            en concepto de anticipo para reserva de garantía para alquiler.
          </p>


          <p>
            1) El precio de la garantía se estipula en{" "}
            {formatCurrency(formData.montoGarantia || "0", formData.monedaGarantia)}, para un alquiler de{" "}
            {formatCurrency(formData.montoAlquiler || "0", formData.monedaAlquiler)}{" "}
            mensual al inicio del contrato de locación, con expensas ordinarias de{" "}
            {formatCurrency(formData.montoExpensas || "0", formData.monedaExpensas)}.
          </p>

          <p>
            2) Se establece como método de pago, una (1) primera cuota a modo de anticipo de{" "}
            {formatCurrency(formData.montoCuotas || "0", formData.monedaCuotas)}{" "}
            y el monto restante en cuotas de{" "}
            {formatCurrency(formData.montoCuotas || "0", formData.monedaCuotas)}{" "}
            a abonarse del 1 al 5 de cada mes. En caso de que la compra se realice abonando de
            contado, el monto restante deberá abonarse a {formData.nombreOrganizacion} al momento de la firma de la
            garantía.
            <br />
            <span className="italic">
              *De incumplirse el plazo de pago de las cuotas se aplicará 1% de punitorios por día.
            </span>
          </p>


          <p>
            3) Las variaciones en el monto del alquiler mensual inicial o las expensas previstas,
            entre la fecha de reserva y la firma de la garantía, se traducirán en la modificación
            del costo de la garantía. En los casos en que la diferencia resultase en un incremento
            del costo, el solicitante abonará la diferencia. Si el valor fuese menor al previsto, {" "}
            {formData.nombreOrganizacion} no realizará reembolso alguno.
          </p>
          <p>
            4) La presente reserva tendrá vigencia hasta el {formData.fechaVencimiento}. El
            solicitante, y los co-solicitantes en el caso que correspondiere, se comprometen y
            obligan a firmar el contrato de fianza en el plazo mencionado.
          </p>
          <p>
            5) En caso de incumplirse la cláusula N°2,3 y/o N° 4, por motivos ajenos a {formData.nombreOrganizacion},
            el solicitante perderá el total de la reserva y/o el pago total en caso de haber
            cancelado la reserva en un solo pago. Asimismo, en caso de obligarse al pago de la
            garantía en cuotas, deberá abonar EL TOTAL de las mismas. Todo ello, bajo apercibimiento
            de iniciar las acciones judiciales correspondientes.
          </p>
          <p>
            En prueba de conformidad se firman dos ejemplares de un mismo tenor y efecto, en la
            ciudad de La Plata, el día {formData.fechaActual}.
          </p>
        </div>

        <div className="flex justify-around h-32 items-end ">
          <div>
            <p>Firma solicitante</p>
          </div>
          <div>
            <p>Firma inmobiliaria</p>
          </div>
          <div>
            <img
              src={firmagerente.src}
              alt="Trust Fund firma"
              className="mb-4"
              style={{
                width: "100px", // Ocupa el 100% del ancho del contenedor
                height: "auto", // Mantiene la proporción de la imagen
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full mb-10">
        <div className=" w-full flex gap-8 h-20 items-center justify-around">
          <div>
            <img
              src={formData.nombreOrganizacion === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src}
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
            formData.nombreOrganizacion === "Trust Fund" ? <>
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

export default PreviewReservationOfWarranty;
