"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { WarrantyFormSchema } from "./warrantyValidations/WarrantyValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { useState } from "react";
import SmallText from "@repo/ui/components/SmallText/SmallText.tsx";
import InputNumber from "../forms/inputs/inputNumber";

export interface WarrantyPrices {
  cashPayment: {
    rentValue: string;
    expenses: string;
    duration: string;
    quantityQuotas: string;
    before: number;
    now: number;
  };
  threeQuotas: {
    rentValue: string;
    expenses: string;
    duration: string;
    quantityQuotas: string;
    downPayment: number;
    quotas: number;
  };
  sixQuotas: {
    rentValue: string;
    expenses: string;
    duration: string;
    quantityQuotas: string;
    downPayment: number;
    quotas: number;
  };
  // twelveQuotas: {
  //   rentValue: string;
  //   expenses: string;
  //   duration: string;
  //   quantityQuotas: string;
  //   downPayment: number;
  //   quotas: number;
  // };
}

export default function FormTrustCalculator() {
  const [error] = useState(false);
  const [warrantyPrices, setWarrantyPrices] = useState<WarrantyPrices>({
    cashPayment: {
      rentValue: "",
      expenses: "",
      duration: "",
      quantityQuotas: "",
      before: 0,
      now: 0,
    },
    threeQuotas: {
      rentValue: "",
      expenses: "",
      duration: "",
      quantityQuotas: "",
      downPayment: 0,
      quotas: 0,
    },
    sixQuotas: {
      rentValue: "",
      expenses: "",
      duration: "",
      quantityQuotas: "",
      downPayment: 0,
      quotas: 0,
    },
    // twelveQuotas: {
    //   rentValue: "",
    //   expenses: "",
    //   duration: "",
    //   quantityQuotas: "",
    //   downPayment: 0,
    //   quotas: 0,
    // },
  });

  const formCalcWarranty = useForm<z.infer<typeof WarrantyFormSchema>>({
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(WarrantyFormSchema),
    defaultValues: {
      rentValue: "",
      expenses: "",
      rentType: "",
      duration: "",
    },
    mode: "onChange", //para verificar el estado mientras se tipea
  });

  const onSubmit = (values: z.infer<typeof WarrantyFormSchema>) => {
    const { rentValue, expenses, duration } = values;
    if (!rentValue || !expenses || !duration || !values.rentType) {
      //pop error
      return;
    }

    const formattedRentValue = Number(rentValue);
    const formattedExpenses = Number(expenses);
    const total = formattedRentValue + formattedExpenses;
    const multiplication = total * Number(duration);

    // valor total de la garantia
    const warrantyTotalValue = multiplication * 0.08;
    //valor de la garantia menos el 20%
    const discount = warrantyTotalValue * 0.8;
    //interes cuando se hace en seis cuotas
    const interest = warrantyTotalValue * 0.48;

    const calculateQuotas = (percentage: number, interest: number) => ({
      threeQuotas: {
        downPayment: percentage * 0.3,
        quotas: (percentage - (percentage * 0.3)) / 2,
      },
      sixQuotas: {
        downPayment: (percentage + interest) * 0.15,
        quotas: (percentage + interest - ((percentage + interest) * 0.15)) / 5,
      },
      // twelveQuotas: {
      //   downPayment: (percentage / 100) * 15,
      //   quotas: ((percentage / 100) * 75) / 11,
      // },
    });

    const quotas = calculateQuotas(warrantyTotalValue, interest);

    setWarrantyPrices({
      cashPayment: {
        rentValue: Number(rentValue).toLocaleString("es-ES"),
        expenses: Number(expenses).toLocaleString("es-ES"),
        duration,
        quantityQuotas: "Contado",
        before: Math.round(warrantyTotalValue),
        now: Math.round(discount),
      },
      threeQuotas: {
        rentValue: Number(rentValue).toLocaleString("es-ES"),
        expenses: Number(expenses).toLocaleString("es-ES"),
        duration,
        quantityQuotas: "3 cuotas s/ interés",
        downPayment: Math.round(quotas.threeQuotas.downPayment),
        quotas: Math.round(quotas.threeQuotas.quotas),
      },
      sixQuotas: {
        rentValue: Number(rentValue).toLocaleString("es-ES"),
        expenses: Number(expenses).toLocaleString("es-ES"),
        duration,
        quantityQuotas: "6 cuotas s/ interés",
        downPayment: Math.round(quotas.sixQuotas.downPayment),
        quotas: Math.round(quotas.sixQuotas.quotas),
      },
      // twelveQuotas: {
      //   rentValue: Number(rentValue).toLocaleString("es-ES"),
      //   expenses: Number(expenses).toLocaleString("es-ES"),
      //   duration,
      //   quantityQuotas: "12 cuotas fijas",
      //   downPayment: Math.round(quotas.twelveQuotas.downPayment),
      //   quotas: Math.round(quotas.twelveQuotas.quotas),
      // },
    });
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <Form {...formCalcWarranty}>
        <form
          className="flex flex-col gap-6 items-center text-center w-full pt-7 xl:flex-row"
          onSubmit={formCalcWarranty.handleSubmit(onSubmit)}
        >
          <FormField
            control={formCalcWarranty.control}
            name="rentValue"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputNumber
                    placeHolder={"Valor del alquiler"}
                    maxLength={15}
                    className="border border-solid border-primary rounded-lg h-12 leading-[150%] font-medium text-foreground placeholder:leading-[150%] placeholder:font-medium placeholder:text-foreground ring-0"
                    //Pasarle al InputNumber valores de react-form
                    value={field.value} // Asegúrate de propagar el valor
                    onChange={field.onChange} // Propaga el onChange handler
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCalcWarranty.control}
            name="expenses"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputNumber
                    placeHolder={"Valor de expensas"}
                    maxLength={15}
                    className="border border-solid border-primary rounded-lg h-12 leading-[150%] font-medium text-foreground placeholder:leading-[150%] placeholder:font-medium placeholder:text-foreground"
                    //Pasarle al InputNumber valores de react-form
                    value={field.value} // Asegúrate de propagar el valor
                    onChange={field.onChange} // Propaga el onChange handler
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCalcWarranty.control}
            name="rentType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select
                    //Pasarle al Select valores de react-form
                    onValueChange={field.onChange}
                    value={field.value}
                    //-----
                  >
                    <SelectTrigger className="w-full border border-solid border-primary rounded-lg h-12 leading-[150%] font-medium text-foreground placeholder:leading-[150%] placeholder:font-medium placeholder:text-foreground bg-primary/15">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Vivienda">Vivienda</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                        <SelectItem value="Campo">Campo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCalcWarranty.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputNumber
                    placeHolder={"Duración"}
                    maxLength={15}
                    className="border border-solid border-primary rounded-lg h-12 leading-[150%] font-medium text-foreground placeholder:leading-[150%] placeholder:font-medium placeholder:text-foreground"
                    //Pasarle al InputNumber valores de react-form
                    value={field.value} // Asegúrate de propagar el valor
                    onChange={field.onChange} // Propaga el onChange handler
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="px-4 py-3 h-11 rounded-[8px] font-bold transition duration-300 border-none min-w-52 w-full md:w-auto"
          >
            Calcular
          </Button>
        </form>
      </Form>
      {warrantyPrices && warrantyPrices?.cashPayment?.now > 0 ? (
        <div className="w-full flex flex-col justify-center items-center gap-8 lg:gap-12">
          <section className="flex flex-row flex-wrap justify-center items-center gap-5 w-full 2xl:flex-nowrap">
            <Button
              className={`group hover:ease-in-out hover:duration-150 hover:text-secondary-foreground hover:bg-primary/10 hover:border-none font-bold w-1/4 flex flex-col justify-center items-center rounded-2xl py-5 min-w-64 min-h-44`}
            >
              <h4 className={`group-hover:font-bold text-2xl leading-7 mb-2`}>Contado</h4>
              <SmallText styles={`group-hover:font-medium  text-sm font-medium`} text="1 Pago de" />
              <p className={`font-bold text-xl leading-7`}>
                $ {warrantyPrices.cashPayment.now.toLocaleString("es-ES")}
              </p>
            </Button>
            <Button
              className={`hover:text-secondary-foreground hover:bg-primary/10 group hover:ease-in-out hover:duration-300hover:border-none hover:font-bold w-1/4 flex flex-col justify-center items-center rounded-2xl py-5 min-w-64 min-h-44`}
            >
              <h4 className={`group-hover:font-bold text-2xl leading-7 mb-2`}>
                3 cuotas s/ interés
              </h4>
              <div className="flex flex-row items-center p-2 border-t-[1px]">
                <div className="border-r-[1px] px-2 flex flex-col justify-center items-center gap-2">
                  <SmallText
                    styles={`group-hover:font-medium  text-sm font-medium`}
                    text="Anticipo 30%"
                  />
                  <p className={`font-bold text-xl leading-7`}>
                    $ {warrantyPrices.threeQuotas.downPayment.toLocaleString("es-ES")}
                  </p>
                </div>
                <div className="px-2 flex flex-col justify-center items-center gap-2">
                  <SmallText
                    styles={`group-hover:font-medium text-sm font-medium`}
                    text="2 cuotas de"
                  />
                  <p className={`font-bold text-xl leading-7`}>
                    $ {warrantyPrices.threeQuotas.quotas.toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
            </Button>
            <Button
              className={`hover:text-secondary-foreground hover:bg-primary/10 group hover:ease-in-out hover:duration-300 hover:border-none hover:font-bold w-1/4 flex flex-col justify-center items-center rounded-2xl py-5 min-w-64 min-h-44`}
            >
              <h4 className={`group-hover:font-bold text-2xl leading-7 mb-2`}>
                6 cuotas s/ interés
              </h4>
              <div className="flex flex-row items-center p-2 border-t-[1px]">
                <div className="border-r-[1px] px-2 flex flex-col justify-center items-center gap-2">
                  <SmallText
                    styles={`group-hover:font-medium  text-sm font-medium`}
                    text="Anticipo 15%"
                  />
                  <p className={`font-bold text-xl leading-7`}>
                    $ {warrantyPrices.sixQuotas.downPayment.toLocaleString("es-ES")}
                  </p>
                </div>
                <div className="px-2 flex flex-col justify-center items-center gap-2">
                  <SmallText
                    styles={`group-hover:font-medium text-sm font-medium`}
                    text="5 cuotas de"
                  />
                  <p className={`font-bold text-xl leading-7`}>
                    $ {warrantyPrices.sixQuotas.quotas.toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
            </Button>
            {/* <Button
              className={` group ${selectedWarrantyPrice && selectedWarrantyPrice?.id === 12 ? `bg-trust border-none` : `bg-white border-2 border-[#E8E6F9] shadow-sm`} hover:ease-in-out hover:duration-300 hover:bg-trust hover:border-none hover:text-primary-foreground hover:font-bold w-1/4 flex flex-col justify-center items-center rounded-2xl py-5 min-w-64 min-h-44`}
              onClick={() => handleSelected(12, warrantyPrices.twelveQuotas)}
            >
              <h4
                className={`group-hover:font-bold ${selectedWarrantyPrice && selectedWarrantyPrice?.id === 12 ? `text-primary-foreground font-bold` : `text-foreground font-medium`} text-2xl leading-7 mb-2`}
              >
                12 cuotas fijas
              </h4>
              <div className="flex flex-row items-center p-2 border-t-[1px]">
                <div className="border-r-[1px] px-2 flex flex-col justify-center items-center gap-2">
                  <SmallText
                    styles={`group-hover:font-medium ${selectedWarrantyPrice && selectedWarrantyPrice?.id === 12 ? `text-primary-foreground` : `text-foreground/80`} text-sm font-medium`}
                    text="Anticipo 15%"
                  />
                  <p
                    className={`${selectedWarrantyPrice && selectedWarrantyPrice.id === 12 ? `text-primary-foreground` : `text-foreground`} font-bold text-xl leading-7`}
                  >
                    ${" "}
                    {warrantyPrices.twelveQuotas.downPayment.toLocaleString(
                      "es-ES"
                    )}
                  </p>
                </div>
                <div className="px-2 flex flex-col justify-center items-center gap-2">
                  <SmallText
                    styles={`group-hover:font-medium ${selectedWarrantyPrice && selectedWarrantyPrice?.id === 12 ? `text-primary-foreground` : `text-foreground/80`} text-sm font-medium`}
                    text="11 cuotas de"
                  />
                  <p
                    className={`${selectedWarrantyPrice && selectedWarrantyPrice.id === 12 ? `text-primary-foreground` : `text-foreground`} font-bold text-xl leading-7 focus-visible:border-none`}
                  >
                    ${" "}
                    {warrantyPrices.twelveQuotas.quotas.toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
            </Button> */}
          </section>
          {error ? (
            <SmallText
              styles={`text-destructive text-sm font-medium`}
              text="Seleccioná como querés pagar tu garantía"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
