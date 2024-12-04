import { NextResponse, NextRequest } from "next/server";
import db, { eq, inmobiliarias, addresses, warranties } from "@repo/database/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Verificar si la inmobiliaria ya existe
    const inmoExist = await db.query.inmobiliarias.findFirst({
      where: eq(inmobiliarias.name, data.name),
    });

    if (inmoExist) {
      return NextResponse.json("La inmobiliaria ya existe creada", {
        status: 409,
        statusText: "Conflict",
      });
    }

    // Iniciar la transacción
    const newInmoSuccess = await db.transaction(async (tx) => {
      // Crear nueva dirección
      const newAddress = await tx
        .insert(addresses)
        .values({
          street: data?.values?.street || "",
          number: data?.number || null,
          intersectionOne: data?.values?.intersectionOne || "",
          intersectionTwo: data?.values?.intersectionTwo || "",
          province: data?.values?.province || "",
          city: data?.values?.localidad || "",
          postalCode: data?.values?.postal_code || "",
        })
        .returning();


      // Verificar que la dirección fue creada correctamente
      if (!newAddress[0]?.id) {
        throw new Error("Error al crear address");
      }

      const addressId = newAddress[0].id;

      // Crear nueva inmobiliaria
      const newInmo = await tx
        .insert(inmobiliarias)
        .values({
          name: data?.values?.name || "",
          inmoAgent: data?.values?.inmoAgent || "",
          phone: data?.values?.phone || "",
          email: data?.values?.email || "",
          comment: data?.values?.comment || "",
          addressId: addressId,
          responsableId: data?.values?.responsableId,
        })
        .returning();
      // Verificar que la inmobiliaria fue creada
      if (!newInmo[0]?.id) {
        throw new Error("Error al crear inmobiliaria");
      }

      const inmobiliariaId = newInmo[0].id;

      // Buscar la garantía por idWarrantie y actualizar el inmobiliariaId
      if (data?.idWarranty) {
        const updatedWarranty = await tx
          .update(warranties)
          .set({ inmobiliariaId: inmobiliariaId })
          .where(eq(warranties.id, data.idWarranty))
          .returning();

        // Verificar que la garantía fue actualizada
        if (!updatedWarranty[0]?.id) {
          throw new Error("Error al actualizar la garantía con la nueva inmobiliaria");
        }
      }

      // Devolver true si todo fue exitoso
      return true;
    });

    // Verificar si la transacción fue exitosa
    if (newInmoSuccess) {
      return NextResponse.json("La inmobiliaria se creó y se actualizó la garantía correctamente", {
        status: 201,
        statusText: "Created",
      });
    } else {
      return NextResponse.json("Algo salió mal", {
        status: 400,
        statusText: "Bad Request",
      });
    }
  } catch (error: any) {
    console.error("Error in POST /register:", error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
