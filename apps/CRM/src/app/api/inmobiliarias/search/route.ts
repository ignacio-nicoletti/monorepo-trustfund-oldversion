import db, { ilike, inmobiliarias, sql } from "@repo/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const searchTerms = params.get("searchTerm");

    if (!searchTerms || typeof searchTerms !== "string") {
      return NextResponse.json(
        { error: "Search term is required" },
        {
          status: 400,
        }
      );
    }

    // Perform the database query
    const result = await db
      .select({
        id: inmobiliarias.id,
        name: sql`CONCAT(${inmobiliarias.name}, ' - ', ${inmobiliarias.inmoAgent})`,
      })
      .from(inmobiliarias)
      .where(ilike(inmobiliarias.name, `%${searchTerms}%`)); // Usar parámetros de búsqueda sin comillas extra.
    // Return the results
    if (result[0]?.id) {
      return NextResponse.json(result, {
        status: 200,
      });
    } else {
      return NextResponse.json(
        { error: "No se encontraron inmobiliarias con ese nombre" },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
