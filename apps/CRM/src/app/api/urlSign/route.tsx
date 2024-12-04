import { NextRequest, NextResponse } from "next/server";
import db, { eq, urlSign } from "@repo/database/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.id?.length) {
      let urlToUpdate = await db.query.urlSign.findFirst({
        where: eq(urlSign.id, data.id),
      });
      const newUrlSign = await db
        .update(urlSign)
        .set({
          url: data.url,
          warrantorId: data.warrantorId
            ? data.warrantorId
            : urlToUpdate?.warrantorId,
          urlTypeId: data.urlTypeId
            ? Number(data.urlTypeId)
            : urlToUpdate?.urlTypeId,
        })
        .returning();

      if (!newUrlSign[0]) {
        return NextResponse.json("Error al actualizar el urlSign", {
          status: 400,
          statusText: "Bad Request",
        });
      }
      return NextResponse.json(newUrlSign[0], { status: 200 });
    } else {
      const newUrlSign = await db
        .insert(urlSign)
        .values({
          url: data.url,
          warrantorId: data.warrantorId,
          urlTypeId: Number(data.urlTypeId),
        })
        .returning();

      if (!newUrlSign[0]) {
        return NextResponse.json("Error al actualizar el urlSign", {
          status: 400,
          statusText: "Bad Request",
        });
      }
      return NextResponse.json(newUrlSign[0], { status: 201 });
    }
  } catch (error: any) {
    console.error(`Error in POST /urlSign`, error);
    return NextResponse.json(`An unexpected error occurred. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}
