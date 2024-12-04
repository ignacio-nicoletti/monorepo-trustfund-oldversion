import React from 'react'
import ReceiptForm from '~/src/components/forms/extra-links-forms/ReceiptForm/ReceiptForm'
import { getAllOrganizations } from '~/src/server-actions/organization'

async function Page() {
 
    const organizations = await getAllOrganizations();

    return (
        <section className="flex flex-col w-full gap-2">
            <h1 className="text-4xl font-bold leading-10 tracking-tighter">Crear un nuevo recibo de Trust-Fund</h1>
            <div className='w-full flex'>
                <ReceiptForm organizations={organizations}/>
            </div>
        </section>
    )
}

export default Page
