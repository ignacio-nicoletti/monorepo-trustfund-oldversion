import { NextResponse } from "next/server";
import db, { eq, warranties, users } from "@repo/database/db";

//Pasos
//Verificar si existen los id
//Verificar si existen los usuarios con los ids
//verificar si el usuario 1 tiene garantias asociadas para continuar
//Actualizar a la garantia para cambiar de responsable 1 a responsable 2
//Si actauliza la garantia correctamente: actualizar los contadores(warrantiesInProcess) de cada usuario
//Si algo male sal responder con el error.

interface TransferRequestBody {
  id1: string; // usuario que va a transferir sus datos al usuario 2
  id2: string; // usuario que recibe las garantias asociadas al usuario 1
}

export async function PUT(req: Request) {
  try {
    const { id1, id2 } = (await req.json()) as TransferRequestBody;

    if (!id1 || !id2) {
      return NextResponse.json(
        {
          message:
            "IDs inválidos. Ambos IDs son necesarios para la transferencia.",
        },
        { status: 400 }
      );
    }

    const transaction = await db.transaction(async (tx) => {
      // Obtener el valor de warrantiesInProcess del usuario con id1
      const user1Data = await tx.query.users.findFirst({
        where: eq(users.id, id1),
      });

      //Obtener los datos del user2 al cual se le van a transferir los datos
      const user2Data = await tx.query.users.findFirst({
        where: eq(users.id, id2),
      });

      if (!user1Data?.id && !user2Data?.id) {
        throw new Error("Al menos uno de los usuarios no se encontro.");
      }

      //Cantidad de warranties asociadas al user2
      const warrantiesTotalForUser1 = user1Data?.warrantiesInProcess ?? 0;
      const warrantiesTotalForUser2 = user2Data?.warrantiesInProcess ?? 0;
      
      const warrantiesClosedForUser1 = user1Data?.warrantiesWon ?? 0;
      const warrantiesClosedForUser2 = user2Data?.warrantiesWon ?? 0;

      //Chequear si tiene  garantias asociadas el user 1
      if (warrantiesTotalForUser1 === 0 || warrantiesTotalForUser1 === null) {
        throw Error(
          "El usuario 1 no contiene garantías asociadas a su nombre."
        );
      }

      const updateResult = await tx
        .update(warranties)
        .set({ userId: user2Data?.id! })
        .where(eq(warranties.userId, user1Data?.id!))
        .returning();

      if (updateResult[0]?.id) {

        const actualizarUser1 = await tx
          .update(users)
          .set({ warrantiesInProcess: 0 , warrantiesWon: 0}) // por el momento se transfieren todas las warranties al otro usuario, por eso que en 0
          .where(eq(users.id, id1))
          .returning();

        const actualizarUser2 = await tx
          .update(users)
          .set({
            warrantiesInProcess:
              warrantiesTotalForUser2 + warrantiesTotalForUser1, // En base a las warranties asociadas se le suman las del user1
            warrantiesWon: 
            warrantiesClosedForUser2 + warrantiesClosedForUser1 // Tambien se le suman las garantias cerradas
            })
          .where(eq(users.id, id2))
          .returning();

        if (actualizarUser1[0]?.id && actualizarUser2[0]?.id) {
          return true;
        } else {
          throw Error(
            "No se pudo actualizar la cantidad de garantías a cada usario"
          );
        }
      } else {
        throw Error("No se pudo actualizar las garantías");
      }
    });

    if (transaction) {
      return NextResponse.json(
        { message: "Transferencia de datos completada con éxito." },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Error en la transaccion." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error en la transferencia de datos:", error);
    return NextResponse.json(
      { message: "Error en el servidor durante la transferencia de datos." },
      { status: 500 }
    );
  }
}
