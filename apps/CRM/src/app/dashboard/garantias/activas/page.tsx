import { columns } from "~/src/components/Tables/DataTableWarranties/columns/completed-warranties/columns";
import { DataTable } from "~/src/components/Tables/DataTableWarranties/DataTable";
import { Metadata } from "next";
import { getAllWarranties } from "~/src/server-actions/warranties";
import { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";
import NoData from "~/src/components/NoData/NoData";

export const metadata: Metadata = {
  title: "Garantias",
  description: "Detalle de las garantias cerradas y que se encuentran en curso",
};
export const revalidate = 0;

export default async function Page() {
  const filter = "Ganada";
  const data = await getAllWarranties(filter);
  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Garantías cerradas ganadas</h1>
      <p className="text-base text-slate-500 font-medium">Detalles de las garantías cerradas ganadas.</p>
      <section className="flex flex-col overflow-x-auto">
        <Suspense fallback={<Spinner size="xl" />}>
          {data?.garantias && data?.garantias.length ? (
            <DataTable data={data} columns={columns} />
          ) : (
            <NoData dataType="Garantias activas" />
          )}
        </Suspense>
      </section>
    </section>
  );
}
