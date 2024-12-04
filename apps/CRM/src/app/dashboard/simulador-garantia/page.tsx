import React from "react";

import { Separator } from "@repo/ui/components/ui/separator.tsx";
import FormTrustCalculator from "~/src/components/buyWarranty/FormTrustCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulador de garantías",
  description:
    "Herramienta para realizar un cálculo rápido del costo de la garantía al contado, en 3 o 6 cuotas.",
};

function Page() {
  return (
    <section className="w-full min-w-80 py-10 px-4 rounded-3xl border border-primary border-solid  md:px-14 md:py-14 bg-secondary shadow-lg">
      <h3 className="font-bold text-3xl md:text-4xl">Simulador de garantías</h3>
      <Separator className="my-6 w-full h-[2px] rounded-full" />
      <p className="font-medium">
        Calculá al instante la garantía de alquiler y conocé las modalidades de pago disponibles.
      </p>
      <FormTrustCalculator />
    </section>
  );
}

export default Page;
