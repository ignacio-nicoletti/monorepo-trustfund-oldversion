import { NextResponse, NextRequest } from "next/server";
import db, { addresses, warrantors, documents } from "@repo/database/db";
import { InferAddress, InferWarrantor } from "@repo/database/types";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const createdWarrantors: InferWarrantor[] = [];
    const createdAddresses: InferAddress[] = [];

    for (const warrantor of data.warrantors) {
      let {
        name,
        lastname,
        email,
        phone,
        dni,
        nacionality,
        country,
        province,
        city,
        street,
        intersectionOne,
        intersectionTwo,
        number,
        postal_code,
        isOwner,
        isRequester,
        driveFolderId,
        documentsData
      } = warrantor;

      // Iniciar la transacci贸n
      await db.transaction(async (tx) => {
        let newAddress = null;
        // Crear o actualizar una direcci贸n
        if (
          (province?.length || street?.length || number?.length)
        ) {
          newAddress = await tx
            .insert(addresses)
            .values({
              country: country?.length ? country : null,
              province: province?.length ? province : null,
              city: city?.length ? city : null,
              street: street?.length ? street : null,
              intersectionOne: intersectionOne?.length ? intersectionOne : null,
              intersectionTwo: intersectionTwo?.length ? intersectionTwo : null,
              number: number ? Number(number) : null,
              postalCode: postal_code,
            })
            .onConflictDoUpdate({
              target: [
                addresses.country,
                addresses.province,
                addresses.city,
                addresses.street,
                addresses.intersectionOne,
                addresses.intersectionTwo,
                addresses.number,
                addresses.postalCode,
              ],
              set: {
                country: country,
                province: province,
                city: city,
                street: street,
                intersectionOne: intersectionOne,
                intersectionTwo: intersectionTwo,
                number: Number(number),
                postalCode: postal_code,
              },
            })
            .returning();

          // Verificar que la direcci贸n fue creada o actualizada
          if (!newAddress[0]?.id) {
            throw new Error("Error al crear o actualizar address");
          }

          createdAddresses.push(newAddress[0]);
        }

        let addressId = newAddress?.[0]?.id;

        // Crear o actualizar el warrantor
        let newWarrantor = await tx
          .insert(warrantors)
          .values({
            name: name?.length ? name : null,
            lastname: lastname?.length ? lastname : null,
            email: email?.length ? email : null,
            phone: phone?.length ? phone : null,
            dni: dni?.length ? dni : null,
            nacionality: nacionality?.length ? nacionality : null,
            isOwner,
            isRequester,
            availability: false,
            warrantyId: data.warrantyId,
            driveFolderId: driveFolderId?.length ? driveFolderId : null,
            addressId: addressId,
          })
          .onConflictDoUpdate({
            target: [
              warrantors.name,
              warrantors.lastname,
              warrantors.email,
              warrantors.phone,
              warrantors.dni,
              warrantors.nacionality,
              warrantors.isOwner,
              warrantors.isRequester,
              warrantors.availability,
              warrantors.warrantyId,
              warrantors.driveFolderId,
              warrantors.addressId,
            ],
            set: {
              name: name,
              lastname: lastname,
              email: email,
              phone: phone,
              dni: dni,
              nacionality: nacionality,
              isOwner:isOwner,
              isRequester:isRequester,
              availability: false,
              warrantyId: data.warrantyId,
              driveFolderId: driveFolderId,
              addressId: addressId,
            },
          })
          .returning();

        // Verificar que el warrantor fue creado o actualizado
        if (!newWarrantor[0]?.id) {
          throw new Error("Error al crear o actualizar warrantor");
        }

        createdWarrantors.push(newWarrantor[0]);

        // Insertar o actualizar documentos
        if (Array.isArray(documentsData)) {
          for (const doc of documentsData) {
            await tx
              .insert(documents)
              .values({
                warrantorId: newWarrantor[0]?.id,
                warrantorDocumentTypesId: doc.type,
                url: doc.url,
                name: doc.name,
              })
              .onConflictDoUpdate({
                target: [
                  documents.warrantorId,
                  documents.warrantorDocumentTypesId,
                  documents.url,
                  documents.name,
                ],
                set: {
                  warrantorId: newWarrantor[0]?.id,
                  warrantorDocumentTypesId: doc.type,
                  url: doc.url,
                  name: doc.name,
                },
              })
              .returning();
          }
        }
      });
    }

    if (createdWarrantors.length) {
      // Devolver los garantes creados
      return NextResponse.json(
        { warrantors: createdWarrantors, addresses: createdAddresses },
        { status: 201 }
      );
    }

    // Si por alguna raz贸n no se crean los garantes
    return NextResponse.json("No se pudo crear o actualizar los garantes", { status: 400 });
  } catch (error: any) {
    console.error("Error in POST /warrantors:", error);
    return NextResponse.json(`An unexpected error occurred. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}
