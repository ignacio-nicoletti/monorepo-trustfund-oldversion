"use client";

// components/InfiniteBanner.js

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

export default function InfiniteBanner() {
  const [array] = useState(new Array(5).fill(0));
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const settings = {
    dots: false, // Desactiva los puntos de navegación
    infinite: true, // Carrusel infinito
    speed: 5000, // Velocidad de desplazamiento en milisegundos
    slidesToShow: windowWidth < 1024 ? 1 : 2, // Muestra un slide a la vez o dos dependiendo de la pantalla
    slidesToScroll: 1, // Desplaza un slide a la vez
    autoplay: true, // Habilita el autoplay
    autoplaySpeed: 0, // Velocidad de autoplay
    cssEase: "linear", // Hacer la transición lineal
    draggable: false, // Desactiva el arrastre
    swipe: true, // Habilita el swipe
    rows: 1, // Asegura que haya solo una fila de slides
    arrows: false
  };

  return (
    <Slider {...settings} className="h-full w-full py-4 flex items-center">
      {array.map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-center px-4 whitespace-nowrap"
          // style={{ minWidth: "100%" }}
        >
          <span className="flex overflow-hidden font-bold italic text-center text-maincolor text-lg lg:text-4xl">
            TRUST FUND GARANTÍAS DE ALQUILER
          </span>
        </div>
      ))}
    </Slider>
  );
}
