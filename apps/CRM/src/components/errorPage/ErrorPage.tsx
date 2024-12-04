import imgErrorIcon from "@assets/pageNotFound.png";
import { Button } from "@repo/ui/components/ui/button.tsx";

interface Props {
  error?: any;
}

const PageError: React.FC<Props> = ({ error }) => {
  const arrayWords = [
    "Ups",
    "Algo salió mal",
    "Oh no",
    "Vaya",
    "Error inesperado",
    "Hmmm, eso no funcionó",
    "Oh-oh",
    "OOPS",
    "Algo no está bien",
    "Rayos",
    "Uy, un problema",
    "Oopsie",
    "Perdón por eso",
    "Parece que algo falló",
    "Volvamos a intentarlo",
    "Lo sentimos",
    "Algo no salió como se esperaba",
  ];

  const randomWord = arrayWords[Math.floor(Math.random() * arrayWords.length)];

  const handleGoBack = () => {
    window.location.href = "/dashboard/";
  };

  const [firstWord, ...rest] = error.split(" ");
  const cleanedMessage = rest.join(" ");

  let status;
  if (firstWord === "Error:") {
    status = 404;
  } else if (firstWord === "Solicitud:") {
    status = 500;
  }

  return (
    <main
      className="bg-primary w-screen h-screen flex text-white max-md:flex-col items-center justify-center"
      style={{ userSelect: "none" }}
    >
      <section className="flex flex-col items-end justify-center">
        <div className="flex flex-col px-4 gap-10 w-auto">
          <div className="flex flex-col gap-5 pr-4 h-auto max-w-96">
            <h1 className="font-bold text-5xl md:text-6xl">¡{randomWord}!</h1>
            <p className="font-medium text-2xl md:text-3xl">Ocurrió un error</p>
            <div className="max-w-96">
              <p
                className="font-medium text-xl md:text-2xl overflow-auto break-words"
                style={{ overflowWrap: "anywhere" }}
                title={cleanedMessage}
              >
                {cleanedMessage || "Hubo un problema inesperado."}
              </p>

              <p className="font-medium text-xl md:text-2xl">
                {status ? `Código de estado: ${status}` : ""}
              </p>
            </div>
          </div>
          <div className="flex justify-between w-full items-center">
            <Button
              onClick={handleGoBack}
              className="bg-[white] text-[#1c68ab] hover:bg-white hover:border hover:border-black"
            >
              Volver
            </Button>
          </div>
        </div>
      </section>
      <section className="flex items-center max-md:mt-10" style={{ userSelect: "none" }}>
        <img
          src={imgErrorIcon.src}
          alt="Image not found"
          className="w-80 md:w-96"
          draggable="false"
        />
      </section>
    </main>
  );
};

export default PageError;
