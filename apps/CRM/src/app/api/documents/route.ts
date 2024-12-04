import { NextRequest, NextResponse } from "next/server";
import db, { documents } from "@repo/database/db";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();

    await Promise.all(
      updatedData.map(async (el: any) => {
        const upsertResult = await db
          .insert(documents)
          .values({
            url: el.url,
            name: el.name,
            warrantorDocumentTypesId: el.warrantorDocumentTypesId
              ? el.warrantorDocumentTypesId
              : undefined,
            warrantyDocumentTypesId: el.warrantyDocumentTypesId
              ? el.warrantyDocumentTypesId
              : undefined,
          })
          .onConflictDoUpdate({
            target: [
              documents.url,
              documents.name,
              documents.warrantorDocumentTypesId,
              documents.warrantyDocumentTypesId,
            ], // El campo que se usará para detectar conflictos
            set: {
              url: el.url, // Campo que se actualizará si ya existe el registro
              name: el.name,
              warrantorDocumentTypesId: el.warrantorDocumentTypesId
                ? el.warrantorDocumentTypesId
                : undefined,
              warrantyDocumentTypesId: el.warrantyDocumentTypesId
                ? el.warrantyDocumentTypesId
                : undefined,
            },
          })
          .returning();

        if (!upsertResult[0]) {
          return NextResponse.json("Error al realizar el upsert en documents", {
            status: 400,
            statusText: "Bad Request",
          });
        }
      })
    );

    return NextResponse.json("Upsert realizado con éxito en documents", { status: 200 });
  } catch (error: any) {
    console.error(`Error en el endpoint PUT /documents/${params.id}:`, error);
    return NextResponse.json(`An unexpected error occurred. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}
