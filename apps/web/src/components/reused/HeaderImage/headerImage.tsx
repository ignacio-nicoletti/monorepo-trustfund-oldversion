import HoverInput from "@/components/footer/hoverInput/hoverInput";
import React from "react";
import bgInmo from "@/assets/images/bg_inmob.png";
import bgPropietario from "@/assets/images/bg_propietarios.png";
import bgIquilino from "@/assets/images/bg_inquilinos.png";

const HeaderImage = ({ data }: any) => {
  const backgroundUrl =
    data?.sectiontitle === "Inmobiliarias"
      ? bgInmo.src
      : data?.sectiontitle === "Inquilino"
        ? bgIquilino.src
        : bgPropietario.src; // Fondo

  const BgClass =
    data?.sectiontitle === "Inmobiliarias"
      ? "bg-[#0D3156]"
      : data?.sectiontitle === "Inquilino"
        ? "bg-[#009FBB]"
        : "bg-[#004993]"; // Clase por defecto

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative">
      <div
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "brightness(65%)",
        }}
        className="relative top-0 left-0 w-full h-full z-0"
      />

      {/* Contenido */}
      <div className="absolute top-[25%] flex flex-col left-[10%] text-white gap-4 w-1/4 max-md:w-2/3 z-10">
        <p>{data.sectiontitle}</p>
        <p className="font-bold text-5xl max-md:text-3xl">{data.subtitle}</p>
        <div className="flex items-center gap-2">
          <p className={`${BgClass} rounded-full p-2 px-4 font-bold`}>{data.buttonText}</p>
          <HoverInput />
        </div>
      </div>

      <div className={`${BgClass} flex justify-center items-center w-full p-5 z-10`}>
        <div className="flex text-white justify-center items-center gap-4 max-md:flex-wrap">
          {data.ArrayOptions.map((el: any) => (
            <div
              key={el.text}
              className="flex text-white flex-col items-center w-44 h-36 text-center p-2 gap-2"
            >
              <img src={el.icon} alt="" className="h-16 w-16" />
              <p>{el.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderImage;
