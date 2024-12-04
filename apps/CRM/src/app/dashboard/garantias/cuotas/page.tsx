// app/dashboard/garantias/cuotas/page.tsx
import { Metadata } from "next";
import React, { Suspense } from "react";
import CuotaDropdown from "~/src/components/Cuotas/CuotaDropdown";
import type { QuotasByMonth } from "~/src/components/Cuotas/types";
import { GetAllQuotas } from "~/src/server-actions/quotas";
import Spinner from "~/src/components/LoadingUI/Spinner";

export const metadata: Metadata = {
  title: "Cuotas/Financiaciones",
  description: "Detalle de las cuotas financiadas o en un pago.",
};

export const revalidate = 0;

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function page(props: Props) {
  const { financingType } = props.searchParams;

  const quotas = await GetAllQuotas(Number(financingType));
  
  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Resumen de cuotas</h1>
      <p className="text-base text-slate-500 font-medium">Información sobre las cuotas corrientes.</p>
      <section className="gap-5">
        <Suspense fallback={<Spinner size="xl" />}>
          {quotas && (
            <CuotaDropdown quotaList={quotas as QuotasByMonth} />
          )}
        </Suspense>
      </section>
    </section>
  );
}
