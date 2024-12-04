import { NextResponse, NextRequest } from "next/server";
import db, { addresses, warrantors, documents, eq } from "@repo/database/db";
import { InferAddress, InferWarrantor } from "@repo/database/types";
import { generateHash } from "~/src/utils/generateHash";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const createdWarrantors: InferWarrantor[] = [];
    const createdAddresses: InferAddress[] = [];

    const updatedWarrantors: InferWarrantor[] = [];
    const updatedAddresses: InferAddress[] = [];

    for (let index = 0; index < data.warrantors.length; index++) {
      let {
        id,
        addressId,
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
        documentsData,
      } = data.warrantors[index];

      if (id?.length > 0) {
        await db.transaction(async (tx) => {
          let newAddress = null;

          if (addressId?.length) {
            await db.query.addresses.findFirst({
              where: eq(addresses.id, addressId),
              columns: { createdAt: false, updatedAt: false },
            });

            newAddress = await tx
              .update(addresses)
              .set({
                country: country || null,
                province: province || null,
                city: city || null,
                street: street || null,
                intersectionOne: intersectionOne || null,
                intersectionTwo: intersectionTwo || null,
                number: number ? Number(number) : null,
                postalCode: postal_code || null,
              })
              .where(eq(addresses.id, addressId))
              .returning();

            if (!newAddress[0]?.id) throw new Error("Error al actualizar la dirección.");
          } else {
            if (province || street || number) {
              newAddress = await tx
                .insert(addresses)
                .values({
                  country,
                  province,
                  city,
                  street,
                  intersectionOne,
                  intersectionTwo,
                  number: number ? Number(number) : null,
                  postalCode: postal_code,
                })
                .returning();

              if (!newAddress[0]?.id) throw new Error("Error al crear la dirección.");
            }
          }

          if (newAddress && newAddress[0]?.id) updatedAddresses.push(newAddress[0]);

          const warrantorToUpdate = await db.query.warrantors.findFirst({
            where: eq(warrantors.id, id),
            columns: { createdAt: false, updatedAt: false },
          });

          const fullName = name + " " + lastname;

          const newWarrantor = await tx
            .update(warrantors)
            .set({
              name: name || null,
              lastname: lastname || null,
              fullname: name + " " + lastname,
              email: email || null,
              phone: phone || null,
              dni: dni || null,
              nacionality: nacionality || null,
              isOwner: isOwner === null && index !== 1 ? false : index === 1 ? true : false,
              isRequester:
                isRequester === null && index !== 0
                  ? false
                  : index === 0 || isRequester
                    ? true
                    : false,
              availability: false,
              warrantyId: data.warrantyId,
              driveFolderId: driveFolderId || null,
              folderName: warrantorToUpdate?.folderName
                ? warrantorToUpdate?.folderName
                : isRequester
                  ? `${name} ${lastname}-${generateHash(fullName)}`
                  : "",
              addressId: newAddress ? newAddress[0]?.id : null,
            })
            .where(eq(warrantors.id, id))
            .returning();

          if (!newWarrantor[0]?.id) throw new Error("Error al actualizar el warrantor.");
          updatedWarrantors.push(newWarrantor[0]);
        });
      } else {
        await db.transaction(async (tx) => {
          let newAddress = null;

          if (province || street || number) {
            newAddress = await tx
              .insert(addresses)
              .values({
                country,
                province,
                city,
                street,
                intersectionOne,
                intersectionTwo,
                number: number ? Number(number) : null,
                postalCode: postal_code,
              })
              .returning();

            if (!newAddress[0]?.id) throw new Error("Error al crear la dirección.");
            createdAddresses.push(newAddress[0]);
          }

          const addressIdFromDb = newAddress?.[0]?.id;

          const fullName = name + " " + lastname;

          const newWarrantor = await tx
            .insert(warrantors)
            .values({
              name: name || null,
              lastname: lastname || null,
              fullname: name + " " + lastname,
              email: email || null,
              phone: phone || null,
              dni: dni || null,
              nacionality: nacionality || null,
              isOwner: isOwner === null && index !== 1 ? false : index === 1 ? true : false,
              isRequester:
                isRequester === null && index !== 0
                  ? false
                  : index === 0 || isRequester
                    ? true
                    : false,
              availability: false,
              warrantyId: data.warrantyId,
              driveFolderId: driveFolderId || null,
              folderName: isRequester ? `${name} ${lastname}-${generateHash(fullName)}` : "",
              addressId: addressIdFromDb,
            })
            .returning();

          if (!newWarrantor[0]?.id) throw new Error("Error al crear el warrantor.");
          createdWarrantors.push(newWarrantor[0]);

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
                .returning();
            }
          }
        });
      }
    }

    if (createdWarrantors.length || updatedWarrantors.length) {
      return NextResponse.json(
        {
          warrantors: updatedWarrantors.length ? updatedWarrantors : createdWarrantors,
          addresses: updatedAddresses.length ? updatedAddresses : createdAddresses,
        },
        { status: 201 }
      );
    }

    return NextResponse.json("No se pudo crear o actualizar los garantes", {
      status: 400,
    });
  } catch (error: any) {
    console.error("Error en POST /warrantors:", error);
    return NextResponse.json(`Ocurrió un error inesperado. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}
