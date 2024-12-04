import db, { mainFolders } from "@repo/database/db";
import { NextRequest, NextResponse } from "next/server";
import { months } from "~/src/utils/month";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data?.url?.length) {
      return NextResponse.json("Debe envíar una url", {
        status: 400,
        statusText: "Bad Request",
      });
    }
    let monthStr = months[new Date().getMonth()];
    let year = new Date().getFullYear();
    const newMainFolder = await db
      .insert(mainFolders)
      .values({
        url: data.url,
        month: monthStr,
        year: year,
      })
      .returning();

    if (!newMainFolder[0]) {
      return NextResponse.json("Error al crear el mainFolder", {
        status: 400,
        statusText: "Bad Request",
      });
    }
    return NextResponse.json(newMainFolder, { status: 201 });
  } catch (error: any) {
    console.error(`Error in POST /urlSign`, error);
    return NextResponse.json(`An unexpected error occurred. ${error.message}`, {
      status: 500,
      statusText: "Internal server error",
    });
  }
}
