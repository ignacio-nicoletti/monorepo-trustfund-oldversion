// ----- Media
import facebookIconWhite from "@/assets/facebookIcons/FacebookIconWhite.svg";
import igIconWhite from "@/assets/igIcons/igIconWhite.svg";
import linkedinIconWhite from "@/assets/linkedinIcons/linkedinIconWhite.svg";
import youtubeIconWhite from "@/assets/youtubeIcons/youtubeIconWhite.svg";

//----Components
import Link from "next/link";
import logoTrustWhite from "@/assets/LogoTrustWhite.png";
import logoTrustBlue from "@/assets/LogoTrustBlue.png";
import wspLogo from "@/assets/wts.svg";
import BurguerIcon from "@/assets/BurguerMenu.svg";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@repo/ui/components/ui/sheet.tsx";
import { Button } from "@repo/ui/components/ui//button.tsx";

const Header: React.FC = () => {
  return (
    <header className="sticky sm:static z-20 top-0 w-full h-full">
      <nav className="flex lg:justify-evenly justify-between items-center p-4 absolute text-white bg-white w-full z-10 md:backdrop-blur lg:bg-transparent sm:h-20 shadow-lg">
        <div>
          <img alt="logoNavbarTrust" src={logoTrustWhite.src} className="max-lg:hidden" />
          <img alt="logoNavbarTrust" src={logoTrustBlue.src} className="lg:hidden" />
        </div>

        <div className="flex gap-8 items-center ">
          <ul className="flex space-x-6 text-base max-lg:hidden">
            <li className="">
              <Link href="/servicios">Servicios</Link>
            </li>
            <li className="">
              <Link href="/inmobiliarias">Inmobiliaria</Link>
            </li>
            <li className="">
              <Link href="/propietarios">Propietarios</Link>
            </li>
            <li className="">
              <Link href="/inquilinos">Inquilinos</Link>
            </li>
            <li className="">
              <Link href="/contacto">Contacto</Link>
            </li>
          </ul>
          <Link href={"https://wa.link/qu7dpf"} target="_blank" className="flex items-center justify-center gap-1 px-4 py-2  rounded-[30px] bg-maincolor text-base max-lg:hidden">
            <img alt="logoNavbarTrust" src={wspLogo.src} />
            <p>Escribinos</p>
          </Link>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger>
                {" "}
                <img alt="facebookIcon" src={BurguerIcon.src} width={24} height={24} className="cursor-pointer " />
              </SheetTrigger>
              <SheetContent className="flex flex-col justify-evenly items-center  overflow-auto focus:border-none border-none">
                <ul className="flex flex-col justify-center items-center text-xl gap-10 text-maincolor">
                  <li className="hover:text-[#A0E838]">
                    <Link href="/servicios">Servicios</Link>
                  </li>
                  <li className="hover:text-[#A0E838]">
                    <Link href="/inmobiliarias">Inmobiliaria</Link>
                  </li>
                  <li className="hover:text-[#A0E838]">
                    <Link href="/propietarios">Propietarios</Link>
                  </li>
                  <li className="hover:text-[#A0E838]">
                    <Link href="/inquilinos">Inquilinos</Link>
                  </li>
                  <li className="hover:text-[#A0E838]">
                    <Link href="/contacto">Contacto</Link>
                  </li>
                </ul>

                <SheetFooter className="text-white gap-10">
                  <div>
                    <p>Nuestras redes sociales</p>
                  </div>
                  <div className="flex gap-10">
                    <img
                      alt="facebookIcon"
                      src={facebookIconWhite.src}
                      width={16}
                      height={16}
                      className="cursor-pointer "
                    />
                    <img alt="igIcon" src={igIconWhite.src} width={36} height={36} className="cursor-pointer" />
                    <img
                      alt="linkedinIcon"
                      src={linkedinIconWhite.src}
                      width={36}
                      height={36}
                      className="cursor-pointer"
                    />
                    <img
                      alt="youtubeIcon"
                      src={youtubeIconWhite.src}
                      width={36}
                      height={36}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1 px-8 py-2  rounded-[30px] bg-[#0076B9] text-base">
                    <img alt="logoNavbarTrust" src={wspLogo.src} />
                    {/* <p>Escribinos</p> */}
                    <Button variant="ghost" className="text-lg">
                      Escribinos
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
