import React from "react";

import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import RegisterOrganizationForm from "~/src/components/forms/organizationForm/register/RegisterOrganizationForm";
import EditOrganizationForm from "~/src/components/forms/organizationForm/edit/EditOrganizationForm";
import { getAllOrganizations } from "~/src/server-actions/organization";

export const metadata: Metadata = {
  title: "Agregar / editar organizaciones",
  description: "Dashboard para agregar una nueva organizacion al crm.",
};

async function Page() {
  const session = await getServerSession(authOptions);
  const organizations = await getAllOrganizations();
  if (!session || session.user.role !== 3) {
    redirect("/session/login");
  }

  return (
    <main className="flex flex-col w-full gap-6">
      <RegisterOrganizationForm />
      <EditOrganizationForm organizations={organizations} />
    </main>
  );
}
export default Page;
