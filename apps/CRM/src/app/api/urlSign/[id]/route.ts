import db, { eq, urlSign } from "@repo/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json("Error al eliminar url, no se envió un id", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    let urlToDelete = await db.query.urlSign.findFirst({
      where: eq(urlSign.id, params.id),
    });

    if (urlToDelete && urlToDelete?.id) {
      let url = await db
        .delete(urlSign)
        .where(eq(urlSign.id, params.id))
        .returning();

      if (!url?.length) {
        throw new Error("No se pudo eliminar la url");
      }

      return NextResponse.json(url[0], { status: 200 });
    } else {
      return NextResponse.json("No se encontro la url", {
        status: 404,
        statusText: "Not Found",
      });
    }
  } catch (error: any) {
    console.error(`Error in DELETE /urlSign/id`, error);
    return NextResponse.json(`An unexpected error occurred. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}
