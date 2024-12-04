import { Metadata } from "next";
import { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";
import { DataTable } from "~/src/components/Tables/DataTableWarranties/DataTable";
import { getAllWarranties } from "~/src/server-actions/warranties";
import { columns } from "~/src/components/Tables/DataTableWarranties/columns/wip-warranties/columns";
import NoData from "~/src/components/NoData/NoData";

export const metadata: Metadata = {
  title: "Garantías cerradas",
  description: "Detalle de las garantías que estan cerradas.",
};

export default async function Page() {
  const filter = "Perdida";
  const data = await getAllWarranties(filter);

  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Garantías cerradas perdidas</h1>
      <p className="text-base text-slate-500 font-medium">Detalles de las garantías cerradas perdidas.</p>
      <section className="flex flex-col overflow-x-auto">
        <Suspense fallback={<Spinner size="xl" />}>
          {data?.garantias && data?.garantias.length > 0 ? (
            <DataTable data={data} columns={columns} />
          ) : (
            <NoData dataType="Garantías cerradas" />
          )}
        </Suspense>
      </section>
    </section>
  );
}
