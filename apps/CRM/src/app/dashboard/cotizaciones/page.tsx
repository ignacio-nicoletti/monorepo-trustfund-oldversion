import React from "react";
import EstimateDirectForm from "~/src/components/forms/extra-links-forms/EstimateDirect/EstimateDirectForm";
import ReservationOfWarranty from "~/src/components/forms/extra-links-forms/ReservationOfWarranty/ReservationOfWarranty";
import { getAllOrganizations } from "~/src/server-actions/organization";

interface Props {}

async function Page(props: Props) {
  const {} = props;

const organizations= await getAllOrganizations()

  return (
    <section className="flex flex-col w-full gap-2">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">
        Cargar una nueva cotizacion directa.
      </h1>
      <div className="w-full flex">
        <EstimateDirectForm organizations={organizations}/>
      </div>
    </section>
  );
}

export default Page;
