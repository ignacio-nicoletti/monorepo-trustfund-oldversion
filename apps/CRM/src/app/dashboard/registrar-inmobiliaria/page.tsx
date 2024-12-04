import React from "react";
import RegisterRealEstate from "~/src/components/forms/RegisterRealEstateForm/RegisterRealEstate";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { Metadata } from "next";
import { getInmo } from "~/src/server-actions/inmobiliarias";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Crear Inmobiliaria",
  description: "Formulario para ingresar una nueva inmobiliaria con la que se han realizado transacciones."
}

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

async function Page(props: Props) {
  const session = await getServerSession(authOptions);
  const { searchParams } = props;

  const data = await getInmo(searchParams?.id!);

  return (
    <RegisterRealEstate
      session={session!}
      searchParams={searchParams}
      data={data!}
    />
  );
}

export default Page;
