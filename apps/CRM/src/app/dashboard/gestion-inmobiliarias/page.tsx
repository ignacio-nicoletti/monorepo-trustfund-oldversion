import { Metadata } from "next";
import React, { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";
import { DataTable } from "~/src/components/Tables/DataTable/DataTable";
import { columns } from "~/src/components/Tables/DataTable/columns/realEstates/columns";
import { GetAllInmobiliarias } from "~/src/server-actions/inmobiliarias";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Inmobiliarias/Asesores",
  description: "Información sobre los asesores, inmobiliarias y las gestiones cargadas hasta el momento.",
};

async function Page() {
  const data = await GetAllInmobiliarias();

  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Inmobiliarias / Asesores</h1>
      <p className="text-base text-slate-500 font-medium">Información acerca de las gestiones actuales.</p>
      <section className="flex flex-col">
        <Suspense fallback={<Spinner size="xl" />}>
          <DataTable data={data} columns={columns} />
        </Suspense>
      </section>
    </section>
  );
}

export default Page;
