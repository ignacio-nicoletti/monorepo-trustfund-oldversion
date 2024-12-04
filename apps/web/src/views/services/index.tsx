"use client";
import {
  Home,
  Flame,
  Wallpaper,
  PencilLine,
  MonitorX,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Card } from "@repo/ui/components/ui/card.tsx";
import Vector2 from "@/assets/Vector2";
import Vector1 from "@/assets/Vector1";
import robo from "@/assets/robo.svg";
import respCivil from "@/assets/responsabilidadcivil.svg";
import golpe from "@/assets/golpe.svg";
import cable from "@/assets/cables.svg";
import ssn from "@/assets/ssn_web.png";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@repo/ui/components/ui/accordion.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import Link from "next/link";
import { useRef } from "react";
export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Garantías de alquiler",
      color: "text-icons",
      hoverColor: "text-smoked",
      bgColor: "bg-darkblue",
      bgHover: "bg-secondaryWeb",
    },
    {
      icon: Flame,
      title: "Seguros\nHogar-Incendio",
      color: "text-icons",
      hoverColor: "text-smoked",
      bgColor: "bg-darkblue",
      bgHover: "bg-secondaryWeb",
    },
    {
      icon: PencilLine,
      title: "Gestión de\nfirma electrónica",
      color: "text-icons",
      hoverColor: "text-smoked",
      bgColor: "bg-darkblue",
      bgHover: "bg-secondaryWeb",
    },
    {
      icon: Wallpaper,
      title: "Creación de\nSitio Web",
      color: "text-icons",
      hoverColor: "text-smoked",
      bgColor: "bg-darkblue",
      bgHover: "bg-secondaryWeb",
    },
  ];

  // Crear referencias para cada sección
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <>
      <div className="bg-darkblue w-full pt-36 3xl:pt-24">
        <div className="h-[30%] w-full hidden 3xl:block">
          <div className="relative flex  item-start justify-start w-full h-32 z-10">
            <div className="h-full absolute left-[-150px] top-[25%]">
              <Vector1 stroke="#009FBB" />
            </div>
          </div>
        </div>
        <div className="lg:max-w-[1410px] mx-auto">
          <div className="mb-12 flex flex-col items-start justify-center px-8">
            <div className="text-smoked text-lg font-medium text-center lg:text-start">
              Trust Fund
            </div>
            <h2 className="text-smoked text-3xl font-medium mt-2 tracking-wide text-start lg:text-4xl">
              Nuestros servicios
            </h2>
          </div>{" "}
        </div>
        <Separator
          orientation="horizontal"
          className="bg-secondaryWeb w-full lg:mb-12"
        />

        <div className="lg:max-w-7xl mx-auto">
          <div className="flex flex-row flex-wrap justify-center items-center gap-4 md:gap-8 py-10 px-5 3xl:py-0">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`${service.bgColor} hover:bg-secondaryWeb p-6 lg:aspect-square w-full sm:w-2/3 h-auto md:w-64 border-4 rounded-2xl border-secondaryWeb flex md:flex-col items-center justify-evenly lg:justify-center text-center transition-transform lg:hover:scale-105 cursor-pointer group gap-5 lg:gap-3`}
                onClick={() => {
                  // Desplazarse a la sección correspondiente
                  sectionRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <service.icon
                  className={`w-12 h-12 text-icons group-hover:text-smoked transition-colors duration-300`}
                />
                <h6
                  className={`${service.hoverColor} text-lg whitespace-pre-line transition-colors duration-300 text-left lg:text-center max-w-44`}
                >
                  {service.title}
                </h6>
              </Card>
            ))}
          </div>
        </div>

        <div className="h-[30%] w-full hidden 3xl:block">
          <div className="relative flex  item-end justify-end w-full h-40">
            <div className="h-full absolute bottom-[-50px] right-[0]">
              <Vector2 fill="#004994" />
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-smoked w-full pt-12 pb-14"
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
      >
        <div className="max-w-[1410px] mx-auto px-5">
          <div className="my-12">
            <div className="text-darktxt text-lg font-medium">
              Garantías de alquiler
            </div>
            <h2 className="text-mainbg text-4xl font-medium mt-2 tracking-wide">
              Trust Fund, <br className="block md:hidden" /> tu mejor opción.
            </h2>
          </div>{" "}
        </div>
        <Separator
          orientation="horizontal"
          className="bg-[#4D4D4D] w-full lg:mb-20"
        />

        <div className="flex flex-row flex-wrap justify-center items-center gap-8 py-10 px-6 w-full mx-auto xl:w-3/4 xl:justify-between lg:py-0 lg:items-start lg:flex-nowrap ">
          <div className="flex flex-col justify-center items-center w-full max-w-xl md:max-w-lg gap-10 lg:w-1/2 lg:max-w-[350px] lg:items-start">
            <h6 className="font-bold text-xl text-left">
              Nuestra garantía de alquiler resguarda los intereses de todas las
              partes involucradas en un contrato de locación.
            </h6>
            <div className="flex gap-2 justify-center items-center">
              <Link
                href={"/"}
                target="_blank"
                className="text-xl text-white font-semibold bg-mainbg rounded-full mb-7 sm:m-0 px-8 py-3 hover:bg-primary/90 hover:scale-105 transition-transform"
              >
                Solicitá tu garantía
              </Link>
              <Link
                href={"/"}
                target="_blank"
                className="p-3 h-auto lg:self-start rounded-full mb-7 sm:m-0 border-[3px] border-mainbg bg-smoked hover:scale-105 hover:bg-smoked transition-transform"
              >
                <ArrowRight className="text-mainbg" />
              </Link>
            </div>
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full md:max-w-[640px] space-y-4"
          >
            <AccordionItem value="item-0" className="border-secondaryWeb">
              <AccordionTrigger
                className="text-left text-xl font-normal hover:no-underline"
                title="quienes somos"
              >
                ¿Quiénes somos?
              </AccordionTrigger>
              <AccordionContent className="text-darktxt border-b-secondaryWeb">
                <p className="text-base">
                  Nuestra{" "}
                  <span className="font-bold">garantía de alquiler</span> cubre
                  las{" "}
                  <span className="font-bold">
                    obligaciones establecidas en un contrato de locación
                  </span>
                  , siendo el respaldo más completo para resguardar los
                  intereses de todas las partes involucradas: inquilinos,
                  propietarios e inmobiliarias.
                </p>
                <p className="mt-4 text-base">
                  Otorgamos{" "}
                  <span className="font-bold">
                    garantías de fianza en todo el territorio nacional
                  </span>{" "}
                  con el aval de Delisud, lo que nos permite contar con un
                  respaldo económico amplio, ya que poseemos fondos para
                  financiar garantías de manera segura y flexible.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-1" className="border-secondaryWeb">
              <AccordionTrigger
                className="text-left text-xl font-normal hover:no-underline"
                title="cobertura"
              >
                ¿Qué cubrimos?
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-darktxt text-base border-b-secondaryWeb">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">🏠</span>
                  <span>
                    <span className="font-bold">Alquiler y expensas.</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">⚡</span>
                  <span>
                    <span className="font-bold">Servicios</span> (Luz, agua,
                    electricidad y SUM).
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">🔧</span>
                  <span>
                    <span className="font-bold">
                      Daños y roturas en el inmueble
                    </span>{" "}
                    (vidrios, cerraduras, grifería, calefactores y/o artefactos
                    de aire acondicionado).
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">🏡</span>
                  <span>
                    <span className="font-semibold">
                      Costos de desalojo ante posible usurpación
                    </span>{" "}
                    del inquilino.
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-secondaryWeb">
              <AccordionTrigger
                className="text-left text-xl font-normal hover:no-underline"
                title="requisitos"
              >
                Requisitos para obtener nuestra garantía
              </AccordionTrigger>
              <AccordionContent className="text-darktxt text-base border-b-secondaryWeb">
                <div className="space-y-3">
                  <p className="font-bold">
                    DNI - Historial crediticio favorable
                  </p>
                  <p className="text-sm">
                    *En caso que tu historial crediticio sea desfavorable, te
                    solicitaremos la inclusión de un co-deudor/a
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-secondaryWeb">
              <AccordionTrigger
                className="text-left text-xl font-normal hover:no-underline"
                title="como obtener"
              >
                ¿Cómo la obtengo?
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-darktxt text-base">
                <p>
                  • Foto del{" "}
                  <span className="font-bold">frente y dorso de tu DNI.</span>
                </p>
                <p>
                  • Elegí el <span className="font-bold">método de pago:</span>{" "}
                  Descuentos de contado - Financiación en cuotas.
                </p>
                <p>
                  • ¡Listo! En menos de 24hs tendrás tu garantía de alquiler.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="bg-secondaryWeb text-white w-full py-24 lg:pt-32 lg:pb-36">
        {/* Header Section */}
        <div
          className="max-w-[1410px] px-5 mx-auto pt-6"
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
        >
          <div className="">
            <div className="text-base lg:text-lg font-medium">Seguros</div>
            <h2 className="text-3xl font-medium mt-2 tracking-wide max-w-5xl lg:text-5xl lg:leading-[3.75rem]">
              ¡Contratá tu <span className="font-bold">seguro de hogar</span> y{" "}
              <span className="font-bold">contra incendios</span> de manera
              fácil, rápida y accedé a beneficios!
            </h2>
          </div>
        </div>
        <Separator
          orientation="horizontal"
          className="bg-white w-full my-8 lg:my-16"
        />

        <div className="flex flex-row flex-wrap justify-center items-center gap-10 py-10 px-6 w-full mx-auto xl:w-3/4 xl:justify-between lg:py-0 lg:items-start lg:flex-nowrap ">
          <div className="flex flex-col justify-center items-center w-full max-w-xl md:max-w-lg gap-10 lg:w-1/2 lg:max-w-[360px] lg:items-start">
            <h6 className="font-bold text-xl text-left">
              Ofrecemos coberturas pensadas a medida y beneficios tanto para
              inquilinos como para propietarios de viviendas.
            </h6>
            <div className="flex gap-2 justify-center items-center">
              <Link
                href={"https://mercibroker.com.ar/"}
                target="_blank"
                className="text-xl font-semibold bg-mainbg rounded-full mb-7 sm:m-0 px-8 py-3 hover:bg-primary/90 hover:scale-105 transition-transform"
              >
                Solicitá tu seguro
              </Link>
              <Link
                href={"https://mercibroker.com.ar/"}
                target="_blank"
                className="p-3 h-auto lg:self-start rounded-full mb-7 sm:m-0 border-[3px] border-mainbg bg-secondaryWeb hover:scale-105 hover:bg-secondaryWeb transition-transform"
              >
                <ArrowRight className="text-mainbg" />
              </Link>
            </div>
            <p>
              Solicitá tu seguro con nuestro partner oficial MERCI PRODUCTORES
              ASESORES DE SEGUROS S.A.{" "}
            </p>
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full md:max-w-2xl space-y-4"
          >
            <AccordionItem value="hogar" className="border-white">
              <AccordionTrigger
                className="text-lg font-semibold text-white py-3 md:px-6 rounded-md hover:no-underline"
                title="hogar"
              >
                <div className="flex flex-col justify-center items-start">
                  <h3 className="text-xl font-normal flex items-end gap-2 mb-6 whitespace-nowrap">
                    <strong className="text-4xl flex flex-row gap-1 items-center justify-start">
                      <Home className="text-icons" size={35} />
                      Hogar.
                    </strong>{" "}
                    Combinado familiar
                  </h3>
                  <h3 className="text-3xl font-normal mb-2">¿Qué cubrimos?</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white rounded-md md:px-6 border-b-white">
                <ul className="space-y-4 text-base font-medium flex flex-col justify-start items-start">
                  <li className="flex items-start justify-start gap-4 w-full">
                    <Flame
                      className="text-white min-w-6"
                      strokeWidth={1.5}
                      size={25}
                    />{" "}
                    <p className="lg:max-w-lg">
                      <strong>Incendio:</strong> El riesgo de incendio para la
                      vivienda y los bienes que contenga tu hogar. Incluye
                      huracán, ciclón y tornado.
                    </p>
                  </li>
                  <li className="flex items-start justify-start gap-4 w-full">
                    <img src={robo.src} alt="robo/hurto" className="w-6" />
                    <p className="lg:max-w-lg">
                      <strong>Robo:</strong> Robo o hurto de los bienes que
                      conforman tu mobiliario.
                    </p>
                  </li>
                  <li className="flex items-start justify-start gap-4 w-full">
                    <MonitorX
                      strokeWidth={1.5}
                      size={25}
                      className="text-white min-w-6"
                    />
                    <p className="lg:max-w-lg">
                      <strong>Electro:</strong> Robo o rotura de
                      electrodomésticos que forman parte de tu hogar.
                    </p>
                  </li>
                  <li className="flex items-start justify-start gap-4 w-full">
                    <img
                      src={respCivil.src}
                      alt="responsabilidad civil"
                      className="w-6"
                    />
                    <p className="lg:max-w-lg">
                      <strong>Responsabilidad civil:</strong> Daños que puedas
                      ocasionar a terceros por hechos privados o como
                      consecuencia de incendio o explosión en tu hogar.
                    </p>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Incendio Accordion */}
            <AccordionItem value="incendio" className="border-white">
              <AccordionTrigger
                className="text-lg font-semibold text-white py-3 md:px-6 rounded-md hover:no-underline"
                title="incendio"
              >
                <div className="flex flex-col justify-center items-start">
                  <h3 className="font-bold text-4xl flex flex-row gap-1 items-center justify-start mb-6">
                    <Flame className="text-icons" size={35} />
                    Incendio.
                  </h3>
                  <h3 className="text-3xl font-normal mb-2">Coberturas</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white rounded-md md:px-6 border-b-white">
                <ul className="space-y-4 text-base font-medium flex flex-col justify-start items-start">
                  <li className="flex items-start justify-start gap-4 w-full">
                    <img
                      src={golpe.src}
                      alt="daños directos"
                      className="w-auto"
                    />
                    <p className="lg:max-w-lg">
                      <strong>Daños directos:</strong> Impactos de aeronaves,
                      vehículos terrestres, humo que provenga de desperfectos en
                      el funcionamiento de cualquier aparato de calefacción
                      ambiental y/o cocina instalados en el bien asegurado.
                    </p>
                  </li>
                  <li className="flex items-start justify-start gap-4 w-full">
                    <img
                      src={cable.src}
                      alt="daños indirectos"
                      className="w-auto"
                    />
                    <p className="lg:max-w-lg">
                      <strong>Daños indirectos:</strong> Cualquier medio
                      empleado para extinguir, evitar o circunscribir la
                      propagación del daño.
                    </p>
                  </li>
                  <li className="flex items-start justify-start gap-4 w-full">
                    <Heart strokeWidth={1.5} className="text-white min-w-6" />
                    <p className="lg:max-w-lg">
                      <strong>Cobertura adicional:</strong> Granizo, terremoto,
                      remoción de escombros y gastos de limpieza, gastos de
                      extinción de incendios, responsabilidad civil a
                      consecuencia de incendio y/o explosión.
                    </p>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-full flex flex-col text-base items-center justify-center md:max-w-[1400px] md:justify-between md:flex-row gap-3 pt-12 md:pt-28 mx-auto">
          <p className="text-center md:text-left md:max-w-2xl">
            *Proveedor de seguros MERCI PRODUCTORES ASESORES DE SEGUROS S.A
            Matrícula N°1722 – Grupo Delsud Administración financiera e
            inmobiliaria S.R.L
          </p>
          <img
            src={ssn.src}
            alt="Logo Superintendencia de Seguros"
            className="w-auto min-w-72 max-w-80"
          />
        </div>
      </div>
    </>
  );
}
