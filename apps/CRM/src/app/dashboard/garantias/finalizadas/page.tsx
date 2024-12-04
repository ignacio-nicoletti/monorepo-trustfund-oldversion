import { Metadata } from "next";
import { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";
import NoData from "~/src/components/NoData/NoData";
import { columns } from "~/src/components/Tables/DataTableExpired/columns/expired-warranties/columns";
import { DataTable } from "~/src/components/Tables/DataTableExpired/DataTable";
import { getAllExpiredWarranties } from "~/src/server-actions/warranties/expired";

export const metadata: Metadata = {
  title: "Garantias vencidas",
  description: "Detalle de las garantias cerradas y que se encuentran en curso",
};
export const revalidate = 0;

export default async function Page() {
  const data = await getAllExpiredWarranties();

  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Garantías finalizadas</h1>
      <p className="text-base text-slate-500 font-medium">Detalles de las que se han vencido.</p>
      <section className="flex flex-col overflow-x-auto">
        <Suspense fallback={<Spinner size="xl" />}>
          {data ? <DataTable data={data} columns={columns} /> : <NoData dataType="Garantias activas" />}
        </Suspense>
      </section>
    </section>
  );
}
