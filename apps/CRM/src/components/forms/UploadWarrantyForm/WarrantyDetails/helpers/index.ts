// types
import { CalculatingPaymentsProps } from "../types/warrantyForm.types";

type CuotaStatus = "Pago" | "Pendiente";

type Cuota = {
  numberOfQuota: number;
  status: CuotaStatus;
  expiration: string;
  amount: number;
  paidPreviously: boolean;
};

// funcion para calcular y generar cuotas
export const calculatingPayments = ({
  valorReserva,
  totalGarantia,
  cuotas,
  reservationDate,
}: CalculatingPaymentsProps): Cuota[] | { message: string } => {
  const garantia = Number(totalGarantia);
  const numCuotas = Number(cuotas);

  // Caso de pago "Contado"
  if (cuotas === "Contado") {
    const saldoRestante = garantia - valorReserva;
    const vencimiento = new Date(reservationDate);
    vencimiento.setMonth(vencimiento.getMonth() + 1);
    vencimiento.setDate(5); // Día fijo 5
    return [
      {
        numberOfQuota: 1,
        status: "Pendiente",
        expiration: vencimiento.toISOString(),
        amount: saldoRestante,
        paidPreviously: false,
      },
    ];
  }

  // Validación para cuotas
  if (isNaN(numCuotas) || numCuotas < 2) {
    return { message: "La cantidad de cuotas debe ser mayor a 1" };
  }

  const saldoRestante = garantia - valorReserva;
  const valorCuotaPendiente = saldoRestante / (numCuotas - 1);
  const cuotasArray = [];

  for (let i = 0; i < numCuotas; i++) {
    const estadoCuota = i === 0 ? "Pago" : "Pendiente";
    const vencimiento = new Date(reservationDate);

    vencimiento.setMonth(vencimiento.getMonth() + i);
    if (i > 0) {
      vencimiento.setDate(5); // Día fijo 5 para todas las cuotas
    }

    cuotasArray.push({
      numberOfQuota: i + 1,
      amount: i === 0 ? valorReserva : valorCuotaPendiente,
      expiration: vencimiento.toISOString(),
      status: estadoCuota as "Pago" | "Pendiente",
      paidPreviously: i === 0 ? true : false,
    });
  }

  return cuotasArray;
};
