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
import { ComercialQuotas, HousingCounted, HousingQuotas } from "./contractModels/basics/noGuarantee";
import ComersialCounted from "./contractModels/basics/noGuarantee/comersial-counted";
import { getContractComponents } from "./utils/getContractComponents";

interface FormData {


  // Datos del contrato
  nombreOrganizacion: string;
  nameApplicant: string;
  dni: string;
  contractType: "Comercio" | "Vivienda" | null;
  coverageType: "Básica" | "Intermedia" | "Completa" | null;
  cantQuotas: string;
  numQuota: number;
  cantCogarante: string;
  numContract: number;
  dateCurrent: string;
  // Datos Personales
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
  dateSignature: string;
  ifCounted: boolean | null;
}

interface ContractPreview {
  data: FormData;
}


function ContractPreview({ data }: ContractPreview) {
  const contractComponents = getContractComponents(data);
  return (
    <div
      id="pdf-content"
      style={{
        width: "200mm",
        padding: "0mm",
        boxSizing: "border-box",
      }}
      className="bg-white flex flex-col items-center text-black font-sans text-sm leading-relaxed gap-1 justify-between max-w-[755px]"
    >
      {/* Banner Superior */}
      <div className="mb-4 px-8  flex justify-between w-full mt-10">
        {/* Imagen de Banner */}
        <img
          src={data.nombreOrganizacion === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src}
          alt="Trust Fund Logo"
          className="w-40"
        />
        <img
          src={data.nombreOrganizacion === "Trust Fund" ? LogoverticalTrustfund.src : OkCredRed.src}
          alt="Trust Fund Logo"
          className="w-40"
        />

      </div>

      {/* Contenido Principal */}
      <div className="px-8 h-full w-full mx-auto">
        {/* Encabezado */}
        <div className="flex w-full my-4 items-center justify-between text-center">
          <h2 className={`text-2xl font-bold ${data.nombreOrganizacion === "Trust Fund" ? "text-[#004993]" : "text-[#E82323]"}`}>Contrato</h2>
          <h1>Contrato Nro. {data.numContract}</h1>
        </div>


        {/* Contenido Principal */}
        <div className="px-8 h-full w-full max-w-3xl mx-auto">
          {contractComponents}
        </div>

        {/* Footer */}
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

export default ContractPreview;
