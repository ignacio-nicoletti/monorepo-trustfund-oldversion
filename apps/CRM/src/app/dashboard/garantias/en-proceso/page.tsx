import { columns } from "~/src/components/Tables/DataTableWarranties/columns/wip-warranties/columns";
import { DataTable } from "~/src/components/Tables/DataTableWarranties/DataTable";
import { Metadata } from "next";
import { getAllWarranties } from "~/src/server-actions/warranties";
import { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";
import NoData from "~/src/components/NoData/NoData";

export const metadata: Metadata = {
  title: "Garantías",
  description: "Detalle de las garantías que se estan gestionando aún.",
};

export default async function Page() {
  const filter = "inProcess";
  const data = await getAllWarranties(filter);

  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Garantías en proceso</h1>
      <p className="text-base text-slate-500 font-medium">
        Información acerca de las garantías que aún no se cerraron.
      </p>
      <section className="flex flex-col">
        <Suspense fallback={<Spinner size="xl" />}>
          {data?.garantias && data?.garantias.length > 0 ? (
            <DataTable data={data} columns={columns} />
          ) : (
            <NoData dataType="Garantías en proceso" />
          )}
        </Suspense>
      </section>
    </section>
  );
}
