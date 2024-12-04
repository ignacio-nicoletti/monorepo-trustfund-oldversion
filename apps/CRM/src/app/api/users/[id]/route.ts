import db, { eq, users } from "@repo/database/db";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "~/src/utils/encrypt";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    let password;

    if (data.password) {
      password = await encrypt(data.password);
    }

    const dataToChange = {
      email: data.email || undefined,
      password: password || undefined,
      image_profile: data.image_profile || undefined,
    };

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, params.id),
    });

    if (existingUser?.id) {
      const updatedUSer = await db
        .update(users)
        .set({
          email: dataToChange.email ? dataToChange.email : existingUser.email,
          password: password ? password : existingUser.password,
          image_profile: dataToChange.image_profile
            ? dataToChange.image_profile
            : existingUser.image_profile,
        })
        .where(eq(users.id, params.id))
        .returning();

      if (updatedUSer[0]?.id) {
        return NextResponse.json("Usuario no encontrado", { status: 201, statusText: "Created" });
      } else {
        return NextResponse.json("Error al actualizar el usuario", {
          status: 400,
          statusText: "Bad request",
        });
      }
    } else {
      return NextResponse.json("Usuario no encontrado", { status: 404, statusText: "Not found" });
    }
  } catch (error: any) {
    return NextResponse.json(error, { status: 500, statusText: "internal server error" });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json(); // Datos enviados en la solicitud

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, params.id),
    });

    if (!existingUser) {
      return NextResponse.json("Usuario no encontrado", { status: 404, statusText: "Not Found" });
    }

    const organizationId = updatedData.organization || existingUser.organizationId;
    const roleId = updatedData.role || existingUser.role;
    let hashedPassword = existingUser.password;

    if (updatedData?.password) {
      hashedPassword = await encrypt(updatedData?.password);
    }

    const updatedUser: any = await db
      .update(users)
      .set({
        name: updatedData.name || existingUser.name,
        lastname: updatedData.lastname || existingUser.lastname,
        email: updatedData.email || existingUser.email,
        warrantiesWon: updatedData.warrantiesWon
          ? Number(updatedData.warrantiesWon)
          : existingUser.warrantiesWon,
        status: updatedData.status ?? existingUser.status,
        image_profile: updatedData.image_profile || existingUser.image_profile,
        organizationId: organizationId,
        role: roleId,
        password: hashedPassword,
      })
      .where(eq(users.id, params.id))
      .returning();

    if (updatedUser[0]) {
      return NextResponse.json(updatedUser[0], { status: 200, statusText: "Updated" });
    } else {
      return NextResponse.json("Error al actualizar el usuario", {
        status: 400,
        statusText: "Bad Request",
      });
    }
  } catch (error: any) {
    console.error("Error in PUT /users/id:", error);
    return NextResponse.json(
      { message: error.message || "Ocurrió un error inesperado." },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar si el usuario existe
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, params.id),
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404, statusText: "Not Found" }
      );
    }

    // Determinar el nuevo estado
    const newStatus = existingUser.status === "Active" ? "Deleted" : "Active";

    // Actualizar el estado del usuario
    const [updatedUser] = await db
      .update(users)
      .set({ status: newStatus })
      .where(eq(users.id, params.id))
      .returning();

    if (updatedUser) {
      return NextResponse.json(updatedUser, { status: 200, statusText: "Updated" });
    } else {
      return NextResponse.json(
        { message: "Error al actualizar el usuario" },
        { status: 400, statusText: "Bad Request" }
      );
    }
  } catch (error: any) {
    console.error("Error en DELETE /users/id:", error);
    return NextResponse.json(
      { message: error.message || "Ocurrió un error inesperado." },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
