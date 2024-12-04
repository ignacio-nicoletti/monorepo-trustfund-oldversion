import logodelsud from "@/assets/logodelsud.svg";
import facebookIcon from "@/assets/facebookIcons/FacebookIcon.svg";
import igIcon from "@/assets/igIcons/igIcon.svg";
import linkedinIcon from "@/assets/linkedinIcons/linkedinIcon.svg";
import youtubeIcon from "@/assets/youtubeIcons/youtubeIcon.svg";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import HoverInput from "./hoverInput/hoverInput";

const Footer: React.FC = () => {
  return (
    <footer className="w-full flex flex-col bg-[#F2F5FB]">
      {/* section1 */}
      <div className="max-w-[1400px] flex flex-col justify-between sm:h-[250px] pt-14 px-5 pb-5 m-auto">
        <div className="flex w-full flex-col sm:flex-row items-start xl:gap-[20rem]">
          {/* subSection1-a */}
          <div className="flex flex-col w-1/2 h-full items-start justify-between gap-2 pb-10 sm:pb-0">
            <div className="mb-2">
              <p className="text-auto text-2xl">Suscríbete a nuestro Newsletter.</p>
            </div>
            <div className="mb-2">
              <HoverInput />
            </div>
          </div>
          {/* subSection1-b */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-8 sm:gap-0 justify-start items-start sm:flex-row sm:justify-between">
              {" "}
              <div>
                <p>
                  <b>Casa central</b>
                </p>
                <p>
                  <b>La Plata- Pcia. de Bs.As</b>
                </p>
                <p>Calle 37 n°125</p>
              </div>
              <div>
                <p>
                  <b>Sucursal Mendoza</b>
                </p>
                <p>
                  <b>Mendoza Capital</b>
                </p>
                <p>Necochea n° 350</p>
              </div>
              <div>
                <p>
                  <b>T: </b>+54 (9) 221 - 3619465
                </p>
                <p>
                  <b>M: </b> info@trustfund.com.ar
                </p>
              </div>
            </div>
            {/* redes&button */}
            <div className="flex flex-col sm:justify-between items-center gap-5 min-[1400px]:flex-row">
              {/* redes */}
              <div className="flex w-full justify-start gap-10">
                <img alt="facebookIcon" src={facebookIcon.src} className="cursor-pointer" />
                <img alt="igIcon" src={igIcon.src} className="cursor-pointer" />
                <img alt="linkedinIcon" src={linkedinIcon.src} className="cursor-pointer" />
                <img alt="youtubeIcon" src={youtubeIcon.src} className="cursor-pointer" />
              </div>
              <Separator orientation="horizontal" className="bg-[#999999] xl:hidden" />
              <Button
                variant="default"
                className="self-start font-light bg-mainbg rounded-full mb-7 sm:m-0 px-12 py-5 sm:px-8 sm:py-5"
              >
                Solicitá tu garantía
              </Button>
              {/* derechos de autor hidden hasta responsive */}
              <div>
                <span className="text-start text-[13px] text-[#999999] m-0 p-0 xl:hidden">
                  Trust Fund 2024©. Todos los derechos reservados.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <span className="text-center text-[#999999] m-0 p-0 max-xl:hidden">
            Trust Fund 2024©. Todos los derechos reservados.
          </span>
        </div>
      </div>
      {/* section2 */}
      <div className="flex flex-col sm:flex-row p-4 justify-evenly max-xl:flex-col max-xl:gap-6 bg-white">
        <div>
          <img src={logodelsud.src} alt="logodelsud" />
        </div>
        <div>
          <ul className="flex gap-8 text-[#999999] max-xl:flex-col max-xl:gap-6">
            <li className="text-sm sm:text-base">Términos y condiciones</li>
            <li className="text-sm sm:text-base">Ver modelo de contrato</li>
            <li className="text-sm sm:text-base">Acerca de Trust Fund</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
