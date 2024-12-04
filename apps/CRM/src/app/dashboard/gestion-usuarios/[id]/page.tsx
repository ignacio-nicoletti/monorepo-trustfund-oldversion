import EditUsersFormbySuperAdmin from "~/src/components/forms/EditUsersFormbySuperAdmin/EditUsersFormbySuperAdmin";
import { fetchUserById } from "~/src/server-actions/users";
import { getMockData } from "~/src/server-actions/getMocks";
import {Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "~/src/app/api/auth/[...nextauth]/authOptions";

export const revalidate = 0;

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const id = params.id;
  
  const user = await fetchUserById(id);
  return {
    title: `${user?.name} ${user?.lastname} (${user?.status === "Active" ? "Activo/a" : "Eliminado/a"})`,
    description: "Editar datos del usuario.",
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session || session.user.role !== 3) {
    
    redirect("/session/login");
  }

  const data = await fetchUserById(id);
  const mockData = await getMockData();

  return <EditUsersFormbySuperAdmin dataUser={data} mockData={mockData} id={id} />;
}
