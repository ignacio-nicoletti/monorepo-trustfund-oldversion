import { Metadata } from "next";
import CreateNewWarranty from "~/src/components/forms/UploadWarrantyForm/ExtraComponents/createNewWarranty";

export const metadata: Metadata = {
  title: "Nueva garantía",
  description: "Creá una nueva garantía.",
};
export const revalidate = 0;
interface Props {}

async function Page() {
  return (
    <section className="flex flex-col w-full gap-6">
      <h1 className="text-4xl font-bold leading-10 tracking-tighter">Cargar nueva garantía</h1>
      <p className="text-base text-slate-500 font-medium">
        Iniciar el proceso de carga de una gestión.
      </p>
      <CreateNewWarranty />
    </section>
  );
}

export default Page;
