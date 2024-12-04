export const Calculator = (data: any) => {
  let formattedRentValue = Number(data.percentages.alquiler);
  let formattedExpenses = Number(data.percentages.expensas);
  const formattedDolar = Number(data.percentages.dolarPrice);

  //si es dolares paso el price que le pase
  if (data.percentages.currencyAlquiler === "USD") {
    formattedRentValue = formattedRentValue * data.percentages.dolarPrice;
  }

  if (data.percentages.currencyExpensas === "USD") {
    formattedExpenses = formattedExpenses * data.percentages.dolarPrice;
  }

  //total en pesos
  const totalAlquiler = formattedRentValue + formattedExpenses;
  const multiplication = totalAlquiler * Number(data.percentages.period);

  // Total de la garantia en pesos
  let total = Math.round(multiplication * data.estimate.percentage); // 4%, 6%, 8%

  if (data.percentages.currencyWarranty === "USD") {
    total = Math.round(total / formattedDolar);
  }

  // Crea la variable de warrantyTotalWithDiscount para almacenar el valor con descuento (si se aplica)
  let warrantyTotalWithDiscountContado = total;
  let warrantyTotalWithDiscount3And6 = total;

  const interest = total * 0.48;

  let percentageContado = 0.3;
  let percentageAnticipo3 = 0.3;
  let percentageAnticipo6 = 0.15;

  // Si se proporciona un descuento para contado
  if (data.percentages.descContado !== null || data.percentages.descContado > 0) {
    percentageContado = Math.round(data.percentages.descContado * 0.01); //si me llega 4 6 8 lo pasa a 0.04
    warrantyTotalWithDiscountContado = Math.round(total * (1 - percentageContado));
  }

  // Si se proporciona un descuento para 3 cuotas
  if (data.percentages.anticipo3Cuotas !== null) {
    percentageAnticipo3 = Math.round(data.percentages.anticipo3Cuotas * 0.01); //si me llega 4 6 8 lo pasa a 0.04
    warrantyTotalWithDiscount3And6 = Math.round(total * (1 - percentageAnticipo3));
  }

  // Si se proporciona un descuento para 6 cuotas
  if (data.percentages.anticipo6Cuotas !== null) {
    percentageAnticipo6 = Math.round(data.percentages.anticipo6Cuotas * 0.01); //si me llega 4 6 8 lo pasa a 0.04
    warrantyTotalWithDiscount3And6 = Math.round(total * (1 - percentageAnticipo6));
  }
  //
  //
  // Cálculo de anticipo y cuotas para contado
  let anticipoContado = Math.round(warrantyTotalWithDiscountContado * percentageContado);
  let cuotasContado = Math.round(warrantyTotalWithDiscountContado - anticipoContado);

  // Cálculo de anticipo y cuotas para 3 cuotas
  let anticipoThreeCuotas = Math.round(warrantyTotalWithDiscount3And6 * percentageAnticipo3);
  let cuotasThreeCuotas = Math.round((warrantyTotalWithDiscount3And6 - anticipoThreeCuotas) / 2);

  // Cálculo de anticipo y cuotas para 6 cuotas
  let anticipoSixCuotas = Math.round(
    (warrantyTotalWithDiscountContado + interest) * percentageAnticipo6
  );
  let cuotasSixCuotas = Math.round(
    (warrantyTotalWithDiscountContado + interest - anticipoSixCuotas) / 5
  );

  return {
    ...data,
    quotesTotal: {
      cashPayment: {
        rentValue: formattedRentValue.toLocaleString("es-ES"),
        expenses: formattedExpenses.toLocaleString("es-ES"),
        duration: data.percentages.period,
        quantityQuotas: "Contado",
        total,
        warrantyTotalWithDiscountContado,
        anticipoContado,
        cuotasContado,
      },
      threeQuotas: {
        rentValue: formattedRentValue.toLocaleString("es-ES"),
        expenses: formattedExpenses.toLocaleString("es-ES"),
        duration: data.percentages.period,
        quantityQuotas: "3 cuotas s/ interés",
        warrantyTotalWithDiscountContado,
        anticipoThreeCuotas,
        cuotasThreeCuotas,
      },
      sixQuotas: {
        rentValue: formattedRentValue.toLocaleString("es-ES"),
        expenses: formattedExpenses.toLocaleString("es-ES"),
        duration: data.percentages.period,
        quantityQuotas: "6 cuotas s/ interés",
        anticipoSixCuotas,
        cuotasSixCuotas,
        warrantyTotalWithDiscountContado,
      },
    },
  };
};
