import React from 'react'
import ReservationOfWarranty from '~/src/components/forms/extra-links-forms/ReservationOfWarranty/ReservationOfWarranty'
import { getAllOrganizations } from '~/src/server-actions/organization'

async function Page() {

const organizations = await getAllOrganizations();
    return (
        <section className="flex flex-col w-full gap-2">
            <h1 className="text-4xl font-bold leading-10 tracking-tighter">Cargar una nueva reserva de garantía</h1>
            <div className='w-full flex'>
              <ReservationOfWarranty organizations={organizations}/>
            </div>
        </section>
    )
}

export default Page
