import { ComercialQuotas, HousingCounted, HousingQuotas } from "../contractModels/basics/noGuarantee";
import ComersialCounted from "../contractModels/basics/noGuarantee/comersial-counted";

interface FormData {
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

  
//Tengo que evaluar

// tipo de contrato:  contractType ( "Comercio" | "Vivienda" )
//Si es con garante: cantCogarante ( "Sin cogarantes", "1", '2' )
//Tipo de la garantia si es basica intermedia o completa:   coverageType: ("Básica" | "Intermedia" | "Completa" | null);
//Si es contado o en cuotas: ifCounted: boolean;

//tipo de contrato BASICA 

//basica - con garante - vivienda - contado
//basica - con garante - vivienda - cuotas

//basica - con garante - comercial - contado
//basica - con garante - comercial - cuotas

//----

//basica - sin garante - vivienda - contado
//basica - sin garante - vivienda - cuotas

//basica - sin garante - comercial - contado
//basica - sin garante - comercial - cuotas

//----

//tipo de contrato Intermedia

//Intermedia - con garante - vivienda - contado
//Intermedia - con garante - vivienda - cuotas

//Intermedia - con garante - comercial - contado
//Intermedia - con garante - comercial - cuotas

//----

//Intermedia - sin garante - vivienda - contado
//Intermedia - sin garante - vivienda - cuotas

//Intermedia - sin garante - comercial - contado
//Intermedia - sin garante - comercial - cuotas

//----

//tipo de contrato Completa

//Completa - con garante - vivienda - contado
//Completa - con garante - vivienda - cuotas

//Completa - con garante - comercial - contado
//Completa - con garante - comercial - cuotas

//----

//Completa - sin garante - vivienda - contado
//Intermedia - sin garante - vivienda - cuotas

//Completa - sin garante - comercial - contado
//Completa - sin garante - comercial - cuotas

//----




export function getContractComponents(data: FormData) {
  const { contractType, cantCogarante, coverageType, ifCounted } = data;

  // BASICA
  if (coverageType === "Básica") {
    if (contractType === "Vivienda") {
      if (cantCogarante === "Sin cogarantes") {
         return ifCounted ? <HousingCounted {...data}/> : <HousingQuotas  {...data}/>;
      } else {
        return ifCounted ? <ComersialCounted /> : <ComercialQuotas />;
      }
    } else if (contractType === "Comercio") {
      if (cantCogarante === "Sin cogarantes") {
        return ifCounted ? <ComersialCounted /> : <ComercialQuotas />;
      } else {
        // return ifCounted ? <HousingCounted /> : <HousingQuotas />;
      }
    }
  }

  // INTERMEDIA
  if (coverageType === "Intermedia") {
    // Implementa lógica específica aquí
    return <h1>Intermedia - En construcción</h1>;
  }

  // COMPLETA
  if (coverageType === "Completa") {
    // Implementa lógica específica aquí
    return <h1>Completa - En construcción</h1>;
  }

  // Caso por defecto
  return <p>No se encontró un contrato válido.</p>;
}
