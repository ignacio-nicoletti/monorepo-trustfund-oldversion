"use client";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { useRouter } from "next/navigation";
import imgErrorIcon from "@assets/pageNotFound.png"; // Asegúrate de que la importación es correcta

export default function PageNotFound() {
  const router = useRouter();

  setTimeout(() => {
    router.push("/dashboard");
  }, 3000);

  return (
    <main
      className="bg-primary w-screen h-screen flex text-white text-2xl max-md:flex-col items-center justify-center"
      style={{ userSelect: "none" }}
    >
      <section className="flex flex-col items-end justify-center ">
        <div className="flex flex-col px-4 gap-10 w-auto">
          <div className="flex flex-col gap-5 pr-4">
            <h1 className="font-bold text-5xl">¡Lo sentimos!</h1>
            <p className="font-medium text-2xl">
              La página que solicitaste
              <br />
              no se encuentra disponible, te redirigiremos...
            </p>
          </div>
          <div className="flex justify-between  w-full items-center">
            <Button className="bg-[white] text-[#1c68ab] hover:bg-white hover:border hover:border-black">
              <a href="/dashboard/gestion-inmobiliarias">Ir a inicio</a>
            </Button>
          </div>
        </div>
      </section>
      <section className=" flex items-center">
        <img src={imgErrorIcon.src} alt="Image not found" className="w-80" draggable="false" />
      </section>
    </main>
  );
}
