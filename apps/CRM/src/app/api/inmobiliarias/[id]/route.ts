import { NextResponse, NextRequest } from "next/server";
import db, {
  eq,
  inmobiliarias,
  addresses,
  warranties,
} from "@repo/database/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const dataParser = {
      ...data,
      number:
        data.values.number === ""
          ? null
          : parseInt(data.values.number, 10) || null,
    };

    const inmoExist = await db.query.inmobiliarias.findFirst({
      where: eq(inmobiliarias.id, params.id),
    });

    if (!inmoExist) {
      return NextResponse.json("La inmobiliaria no existe", {
        status: 404,
        statusText: "Not found",
      });
    }

    const newInmoSuccess = await db.transaction(async (tx) => {
      const newAddress = await tx
        .update(addresses)
        .set({
          country: data.values.country,
          street: data.values.street,
          number: dataParser.number,
          intersectionOne: data.values.intersectionOne,
          intersectionTwo: data.values.intersectionTwo,
          province: data.values.province,
          city: data.values.localidad,
          postalCode: data.values.postal_code,
        })
        .where(eq(addresses.id, inmoExist.addressId!))
        .returning();

      const addressId = newAddress[0]?.id;

      const newInmo = await tx
        .update(inmobiliarias)
        .set({
          name: data.values.name,
          inmoAgent: data.values.inmoAgent,
          phone: data.values.phone,
          email: data.values.email,
          comment: data.values.comment,
          addressId: addressId,
          responsableId: data.values.responsableId,
        })
        .where(eq(inmobiliarias.id, params.id))
        .returning();

      if (!newInmo[0]?.id) {
        throw new Error("Error al editar inmobiliaria");
      }

      const inmobiliariaId = newInmo[0].id;
      if (data?.idWarranty) {
        const updatedWarranty = await tx
          .update(warranties)
          .set({ inmobiliariaId: inmobiliariaId })
          .where(eq(warranties.id, data.idWarranty))
          .returning();

        if (!updatedWarranty[0]?.id) {
          throw new Error(
            "Error al actualizar la garantía con la nueva inmobiliaria"
          );
        }
      }
      return true;
    });

    if (newInmoSuccess) {
      return NextResponse.json("La inmobiliaria se creó correctamente", {
        status: 200,
        statusText: "Updated",
      });
    } else {
      return NextResponse.json("Algo salió mal", {
        status: 400,
        statusText: "Bad Request",
      });
    }
  } catch (error: any) {
    console.error("Error in PUT /register:", error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (params.id && params.id !== "undefined") {
      const inmobiliaria = await db
        .select()
        .from(inmobiliarias)
        .leftJoin(addresses, eq(inmobiliarias.addressId, addresses.id))
        .where(eq(inmobiliarias.id, params.id))
        .limit(1);

      if (inmobiliaria.length === 0) {
        return NextResponse.json("Inmobiliaria no encontrada", {
          status: 404,
          statusText: "Not Found",
        });
      }

      return NextResponse.json(inmobiliaria[0], {
        status: 200,
      });
    } else {
      const allInmobiliarias = await db
        .select()
        .from(inmobiliarias)
        .leftJoin(addresses, eq(inmobiliarias.addressId, addresses.id));

      return NextResponse.json(allInmobiliarias, {
        status: 200,
      });
    }
  } catch (error: any) {
    console.error("Error en GET /inmobiliarias:", error);
    return NextResponse.json(
      { message: error.message || "Ocurrió un error inesperado." },
      { status: 500 }
    );
  }
}

// TODO: METODO DELETE ==> TIENE QUE HACER UN UPDATE A LA INMOBILIARIA Y PASARLE UN deletedAt.

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (params.id && params.id !== "undefined") {
      const inmobiliaria = await db
        .select()
        .from(inmobiliarias)
        .leftJoin(addresses, eq(inmobiliarias.addressId, addresses.id))
        .where(eq(inmobiliarias.id, params.id))
        .limit(1);

      if (inmobiliaria.length === 0) {
        return NextResponse.json("Inmobiliaria no encontrada", {
          status: 404,
          statusText: "Not Found",
        });
      }

      // Primero elimina la inmobiliaria
      let deleteInmoProcess = await db.transaction(async (tx) => {
        let deleteInmo = await tx
          .delete(inmobiliarias)
          .where(eq(inmobiliarias.id, params.id))
          .returning();

        if (deleteInmo && deleteInmo[0]?.id) {
          return "inmoDeleted";
        } else {
          throw new Error("Fallo al eliminar la inmobiliaria");
        }
      });

      // Luego elimina la dirección
      if (deleteInmoProcess === "inmoDeleted") {
        let deleteAddressProcess = await db.transaction(async (tx) => {
          let addressId = inmobiliaria[0]?.inmobiliarias?.addressId;

          if (addressId) {
            let deleteAddress = await tx
              .delete(addresses)
              .where(eq(addresses.id, addressId))
              .returning();

            if (deleteAddress && deleteAddress[0]?.id) {
              return "success";
            } else {
              throw new Error("Fallo al eliminar la dirección");
            }
          } else {
            return "success";
          }
        });

        if (deleteAddressProcess === "success") {
          return NextResponse.json({
            status: 200,
          });
        }
      }
    } else {
      throw new Error("No se envió un identificador");
    }
  } catch (error: any) {
    console.error("Error en GET /inmobiliarias:", error);
    return NextResponse.json(
      { message: error.message || "Ocurrió un error inesperado." },
      { status: 500 }
    );
  }
}
