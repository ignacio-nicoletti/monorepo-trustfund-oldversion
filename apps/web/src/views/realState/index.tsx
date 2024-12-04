import AboutRealState from "@/components/realStateComponents/AboutRealState/aboutRealState";
import Brands from "@/components/realStateComponents/Brands/brands";
import Service from "@/components/realStateComponents/Services/service";
import HeaderImage from "@/components/reused/HeaderImage/headerImage";
import receivMoney from "@/assets/Sectioninmobiliaria/money-recive.svg";
import monitor from "@/assets/Sectioninmobiliaria/monitor.svg";
import book from "@/assets/Sectioninmobiliaria/archive-book.svg";
import velocity from "@/assets/Sectioninmobiliaria/rapidez.svg";



export default function RealState() {
  const dataInmo = {
    sectiontitle: "Inmobiliarias",
    subtitle: "Tu aliado de confianza",
    buttonText: "Adherí tu inmobiliaria",
    ArrayOptions: [
      {
        icon: receivMoney.src,
        text: "Las comisiones más altas del mercado",
      },
      {
        icon: book.src,
        text: "Velocidad en la entrega",
      },
      {
        icon: velocity.src,
        text: "Rápida respuesta ante reclamos",
      },
      {
        icon: monitor.src,
        text: "Gestión 100% online",
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen pt-8">
      <HeaderImage data={dataInmo} />
      <AboutRealState />
      <Service />
      <Brands />
    </div>
  );
}
