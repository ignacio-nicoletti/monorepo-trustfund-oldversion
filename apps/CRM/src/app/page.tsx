import LoginForm from "@components/forms/LoginForm/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Página de inicio de sesion para asesores de Trust Fund/OkCred.",
};

export default async function Home() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
