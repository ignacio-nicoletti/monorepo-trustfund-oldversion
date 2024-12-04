"use client"
//aca traigo de componnets 
import {
    MessagesSquare,
    Mail,
    MapPin
} from 'lucide-react';
import vector from "../../assets/VectorRari.svg"
import contactImg from "../../assets/contactImg.svg"
import VectorBlack from "../../assets/VectorBlack.svg"
import ContactCards from './contactCards';
import ContactForm from './contactForm';

export default function Contacto() {

    const itemsCard = [{
        type:'whatsapp',
        icon:MessagesSquare,
        title: "Comunicate al 9 54 221 3619465",
        url: 'https://api.whatsapp.com/send/?phone=542213619465&text=%C2%A1Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20las%20garant%C3%ADas%20de%20alquiler%20%F0%9F%99%8C%F0%9F%8F%BC&app_absent=0'
    },
    {
        type:'email',
        icon: Mail,
        title: "Escribinos a info@trustfund.com.ar",
        url: 'mailto:info@trustfund.com.ar'
    },
    {
        type:'location',
        icon: MapPin,
        title: "Calle 37 #125. La Plata. Necochea 365. Mendoza",
        url: 'https://www.google.com/maps/place/CDI,+C.+37+125,+B1902+La+Plata,+Provincia+de+Buenos+Aires/@-34.8957491,-57.953716,891m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95a2e6512e4d99ed:0x2d28e8e36903064f!8m2!3d-34.8957491!4d-57.953716!16s%2Fg%2F11gr6d6vjt?hl=es&entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D'
    }
    ]

    return (
        <main className='min-h-screen'>
            <section className='bg-[#E5E6EB] w-full min-h-screen pt-24'>
                <div className='flex h-1/4 pt-8 sm:py-16 mb-4  flex-col sm:flex-row'>
                    <div>
                        <img src={vector.src} className='w-24 sm:w-48' />
                    </div>
                    <div className='text-left ml-8 sm:ml-12 mt-8 sm:mt-32'>
                        <span className='text-base sm:text-2xl font-light'>Contacto</span>
                        <h1 className='text-2xl sm:text-4xl xl:text-[49px] font-medium'>Nuestras vías de contacto</h1>
                    </div>
                </div>
                <div className=' h-auto sm:h-3/4 flex p-0 xl:pt-24 border-t-2 flex-col xl:flex-row border-[#009FBB] gap-8 sm:gap-0 xl:gap-20 '>
                    <div className='w-80 xl:h-60 m-0 p-4 ml-4  2xl:ml-60 mt-4'>
                        <p className='font-bold text-xl'>Te facilitamos nuestras vías de contacto para que puedas comunicarte de manera sencilla y rápida.</p>
                    </div>
                    <div className='flex gap-5 mb-12 xl:mb-44 h-auto items-center md:mb-16 justify-center flex-col md:flex-row'>
                        {
                            itemsCard.map((e, index) => (
                                <ContactCards url={e.url} type={e.type} title={e.title} icon={e.icon} key={index} />
                            ))
                        }
                    </div>
                </div>

            </section>
            <section className='bg-[#04417F] flex flex-col text-white'>
                <div className="flex h-1/4 sm:py-20 flex-col sm:flex-row relative">
                    <div className="sm:m-auto ml-8 my-14 sm:ml-60  sm:mt-32">
                        <span className="text-base sm:text-2xl font-light ">Reclamos</span>
                        <h1 className="text-2xl sm:text-4xl xl:text-[49px] font-medium mt-2">¿No encontrás lo que buscás?</h1>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-1/2 ">
                        <img
                            src={VectorBlack.src}
                            className="w-24 sm:w-32 xl:w-60"
                        />
                    </div>
                </div>

                <div className='border-t-2  border-[#009FBB] mb-16 sm:mb-0 flex flex-col-reverse sm:flex-row'>
                    <div className='flex w-full sm:mt-0 mt-5  sm:w-1/2 '>
                        <img src={contactImg.src} className='w-[800px] sm:h-[800px]' />
                    </div>
                    <div className='ml-2  sm:my-auto w-full sm:w-1/2'>
                        <ContactForm />
                    </div>
                </div>
            </section>

        </main>
    )
}

