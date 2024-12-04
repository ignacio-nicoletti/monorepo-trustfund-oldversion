import db, { eq, organizations } from "@repo/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json(); // Datos enviados en la solicitud

    const orgId = parseInt(params.id, 10);
    if (isNaN(orgId)) {
      return NextResponse.json("ID de organización inválido", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const existingOrganization = await db.query.organizations.findFirst({
      where: eq(organizations.id, orgId), // Usa el ID convertido
    });

    if (!existingOrganization) {
      return NextResponse.json("Organización no encontrada", {
        status: 404,
        statusText: "Not Found",
      });
    }

    const updatedOrganization = await db
      .update(organizations)
      .set({
        type: updatedData.type,
        logoUrl: updatedData.logoUrl,
      })
      .where(eq(organizations.id, orgId))
      .returning();

    if (updatedOrganization[0]) {
      return NextResponse.json(updatedOrganization[0], { status: 200, statusText: "Updated" });
    } else {
      return NextResponse.json("Error al actualizar la organización", {
        status: 400,
        statusText: "Bad Request",
      });
    }
  } catch (error: any) {
    console.error("Error in PUT /organization/id:", error);
    return NextResponse.json(
      { message: error.message || "Ocurrió un error inesperado." },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
