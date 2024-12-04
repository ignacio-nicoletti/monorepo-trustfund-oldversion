import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import EditUserForm from "~/src/components/forms/EditUserForm/EditUserForm";
import { redirect } from "next/navigation";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Metadata } from "next";
import { getUser } from "~/src/server-actions/users";
import { Suspense } from "react";
import Spinner from "~/src/components/LoadingUI/Spinner";

export const metadata: Metadata = {
  title: "Mi perfíl",
  description: "Ver datos de tu cuenta, y editar email/contraseña.",
};

export default async function page() {
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await getUser(session?.user?.id);

    return (
      <section className="flex flex-col gap-6 w-full">
        <h1 className="text-4xl font-bold leading-10 tracking-tighter">Mi perfil</h1>
        <p className="text-base text-slate-500 font-medium">Mirá y editá alguno de tus datos de cuenta.</p>
        <Suspense fallback={<Spinner size="xl" />}>
          <div className="grid grid-cols-2 gap-5 w-full bg-primary rounded-lg p-5 relative">
            {/* Imagen del camarón */}
            <div className="absolute top-[-60px] right-[20px] w-24 h-24 rounded-full">
              <img
                src={
                  user?.image_profile
                    ? `${user.image_profile}`
                    : "https://st5.depositphotos.com/50790684/68914/i/450/depositphotos_689141866-stock-photo-sad-icon-flat-design.jpg"
                }
                alt={user?.name ? user.name : "foto de perfil"}
                className="rounded-full w-full h-full object-cover border-4 border-white"
              />
            </div>

            {/* Información del usuario */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-start flex w-full text-primary-foreground" htmlFor="name">
                  Nombre(s):
                </Label>
                <Input
                  disabled
                  value={user!.name as string}
                  id="name"
                  className="bg-secondary font-bold disabled:opacity-100 hover:cursor-default"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-start flex w-full text-primary-foreground" htmlFor="email">
                  Correo electrónico:
                </Label>
                <Input
                  disabled
                  value={user!.email as string}
                  id="email"
                  className="bg-secondary font-bold disabled:opacity-100 hover:cursor-default"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-start flex w-full text-primary-foreground" htmlFor="warrantiesWon">
                  Ventas totales:
                </Label>
                <Input
                  disabled
                  value={user!.warrantiesWon?.toString()}
                  id="warrantiesWon"
                  className="bg-secondary font-bold disabled:opacity-100 hover:cursor-default"
                />
              </div>
            </div>
          </div>
          <EditUserForm user={{ image_profile: user?.image_profile, email: user?.email, id: user?.id }} />
        </Suspense>
      </section>
    );
  } else {
    return redirect("/");
  }
}
