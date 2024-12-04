import db, { eq, organizations } from "@repo/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const organizationFound = await db.query.organizations.findFirst({
      where: eq(organizations.type, data.type),
    });

    if (organizationFound) {
      return NextResponse.json("La organización ya está registrada", {
        status: 400,
      });
    }
    const organizationsLength = await (await db.query.organizations.findMany()).length;

    const newOrganization = await db
      .insert(organizations)
      .values({
        id: organizationsLength + 1,
        type: data.type,
        logoUrl: data.logoUrl || null,
      })
      .returning();
      
    if (newOrganization[0]) {
      return NextResponse.json("Se creo con exito", { status: 200 });
    } else {
      return NextResponse.json("Fallo la creacion de la organizacion", {
        status: 400,
      });
    }
  } catch (error: any) {
    console.error("Error in POST /register:", error);
    return NextResponse.json("An unexpected error occurred.", {
      status: 500,
    });
  }
}
