import { Metadata } from "next";
import Register from "~/src/components/forms/RegisterForm/Register";
import { getMockData } from "~/src/server-actions/getMocks";

export const metadata: Metadata = {
  title: "Registrar asesor",
  description: "Formulario para registrar un nuevo usuario en la plataforma."
}

export default async function Page() {
  const mockData = await getMockData();
  return <Register mockData={mockData}/>;
}
