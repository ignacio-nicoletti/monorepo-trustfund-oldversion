import { Metadata } from "next";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";
import { authOptions } from "~/src/app/api/auth/[...nextauth]/authOptions";
import UploadWarrantyForm from "~/src/components/forms/UploadWarrantyForm/UploadWarrantyForm";
import Spinner from "~/src/components/LoadingUI/Spinner";
import { getMockData } from "~/src/server-actions/getMocks";
import { getWarrantyById } from "~/src/server-actions/warranties";

export const metadata: Metadata = {
  title: "Cargar garantía",
  description: "Formulario por pasos para ir cargando información a medida que se gestiona al cliente.",
};
export const revalidate = 0;

interface Params {
  id: string;
}

async function Page({ params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  const warranty = await getWarrantyById(params.id);

  if (session?.user.role === 1 && warranty.userId !== session.user.id) {
    throw Error("Error: No estas autorizado para editar ésta garantía ❌");
  }

  if (!warranty) {
    throw new Error("Error: No existe la garantía solicitada");
  } else {
    const mockData = await getMockData();
    return (
      <section className="flex flex-col w-full gap-6">
        <h1 className="text-4xl font-bold leading-10 tracking-tighter">Cargar garantía</h1>
        <p className="text-base text-slate-500 font-medium">Cargar en el sistema una garantía.</p>
        <Suspense fallback={<Spinner size="lg" />}>
          <UploadWarrantyForm mockData={mockData} />
        </Suspense>
      </section>
    );
  }
}
export default Page;
