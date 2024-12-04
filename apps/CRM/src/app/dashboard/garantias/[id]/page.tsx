import { Metadata } from "next";
import DropdownWarranties from "~/src/components/detailWarranty/DropdownWarranties/DropdownWarranties";
import { getWarrantyRelations } from "~/src/server-actions/warranties";
import { formatDate } from "~/src/utils/formatDate";
import { getInmo } from "~/src/server-actions/inmobiliarias";
import { GetAllQuotasByWarranty } from "~/src/server-actions/quotas";
import { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Detalle de garantías ",
  description: "Detalle de las garantías cerradas y que se encuentran en curso",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const warranties = await getWarrantyRelations(id);
  const inmobiliaria = await getInmo(
    warranties?.warrantyWithRelations?.warranties.inmobiliariaId
  );
  const quotas = await GetAllQuotasByWarranty(id);
  
  if (warranties === undefined) {
    throw new Error("Error: No existe una garantia con ese id");
  }

  const dataDetail = {
    detailWarranties: {
      status: warranties?.warrantyWithRelations?.statusWarranty?.type,
      warrantieId: warranties?.warrantyWithRelations?.warranties?.id,
      reservationDate: warranties?.warrantyWithRelations?.warranties?.reservationDate
        ? formatDate(warranties?.warrantyWithRelations?.warranties?.reservationDate)
        : "-",
      reservationAmount: warranties?.warrantyWithRelations?.warranties?.reservationAmount || "-",
      warrantyAmount: warranties?.warrantyWithRelations?.warranties?.warrantyAmount || "-",
      startDate: warranties?.warrantyWithRelations.datePeriods?.startDate
        ? formatDate(warranties?.warrantyWithRelations.datePeriods?.startDate)
        : "-",
      endDate: warranties?.warrantyWithRelations.datePeriods?.endDate
        ? formatDate(warranties?.warrantyWithRelations.datePeriods?.endDate)
        : "-",
      contractDuration: warranties?.warrantyWithRelations?.warranties?.contractDuration || "-",
      warrantyTypes: warranties?.warrantyWithRelations?.warrantyTypes?.type || "-",
      coverageTypes: warranties?.warrantyWithRelations?.coverageTypes?.type || "-",
      financingTypes: warranties?.warrantyWithRelations?.financingTypes?.type || "-",
      currencyTypes: warranties?.warrantyWithRelations?.currencyTypes?.type || "-",
      responsable:
        warranties?.warrantyWithRelations?.users.name +
        " " +
        warranties?.warrantyWithRelations?.users.lastname,
      responsableId: warranties?.warrantyWithRelations?.users.id,
    },
    documentsWarranty: warranties?.warrantyWithRelations?.documents,
    warrantors: warranties?.warrantorsWithRelations,
    inmobiliaria: {
      name: warranties?.warrantyWithRelations?.inmobiliarias?.name,
      inmoAgent: warranties?.warrantyWithRelations?.inmobiliarias?.inmoAgent,
      email: warranties?.warrantyWithRelations?.inmobiliarias?.email,
      phone: warranties?.warrantyWithRelations?.inmobiliarias?.phone,
      postal_code: inmobiliaria?.addresses?.postalCode,
      city: inmobiliaria?.addresses?.city,
      province: inmobiliaria?.addresses?.province,
    },
    quotas: quotas,
    documentsWarrantors: warranties?.warrantorsWithRelations.flatMap((el: any) => {
      if (Array.isArray(el.documents)) {
        return el.documents;
      }
      return []; // Si no hay documentos, devolvemos un array vacío
    }),
  };

  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">
        Garantía de alquiler
      </h1>
      <p className="text-base text-slate-500 font-medium">
        Vea los detalles de la garantía cargada.
      </p>
      <Suspense fallback={<Spinner size="xl" />}>
        <DropdownWarranties warranties={dataDetail}/>
      </Suspense>
    </section>
  );
}
