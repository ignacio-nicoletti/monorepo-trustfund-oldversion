import { getServerSession } from "next-auth";
import { columnsUser } from "~/src/components/Tables/DataTableUsers/columns/usersColumns/columns";
import { DataTableUsers } from "~/src/components/Tables/DataTableUsers/DataTableUsers";
import { getAllUsers } from "~/src/server-actions/users";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";

export const metadata: Metadata = {
  title: "Usuarios registrados",
  description: "Información sobre los asesores registrados actualmente en la plataforma.",
};

export default async function page() {
  const data = await getAllUsers();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 3) {
    redirect("/session/login");
  }

  return (
    <main className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Usuarios</h1>
      <p className="text-base text-slate-500 font-medium">Información acerca de los usuarios.</p>
      <section className="flex flex-col">
        <Suspense fallback={<Spinner size="xl" />}>
          <DataTableUsers columns={columnsUser} data={data} />
        </Suspense>
      </section>
    </main>
  );
}
