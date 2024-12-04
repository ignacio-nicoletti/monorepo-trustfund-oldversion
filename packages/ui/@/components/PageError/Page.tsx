import { Button } from "../ui/button";
//@ts-ignore todo: implementar tipado de las img
import LogoFlexy from "@assets/images/Flexy.svg";
//@ts-ignore todo: implementar tipado de las img
import imgError from "@assets/images/noEncontrado.svg";
interface Props {}

function PageError(props: Props) {
  const {} = props;

  return (
    <main className="w-screen h-screen flex">
      <section className="w-1/2 flex flex-col items-end justify-center">
        <div className="flex flex-col px-4 gap-10 w-auto">
          <div className="flex flex-col gap-5 pr-4">
            <h1 className="font-bold text-5xl">¡Lo sentimos!</h1>
            <p className="font-medium text-2xl">
              La página que solicitaste
              <br />
              no se encuentra disponible.
            </p>
          </div>
          <div className="flex justify-between  w-full items-center">
            <Button className="bg-[#504cd3]">
              <a href="/home">Ir a inicio</a>
            </Button>
            <img src={LogoFlexy.src} alt="Image not found" className="w-36" />
          </div>
        </div>
      </section>
      <section className="w-1/2 flex items-center">
        <img src={imgError.src} alt="Image not found" className="w-80" />
      </section>
    </main>
  );
}

export default PageError;
