import { NextResponse, NextRequest } from "next/server";
import db, { addresses, eq, organizations, roles, users } from "@repo/database/db";
import { encrypt } from "~/src/utils/encrypt";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const userFound = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (userFound) {
      return NextResponse.json("Este email está registrado", {
        status: 400,
      });
    }

    const organizationRecord = await db.query.organizations.findFirst({
      where: eq(organizations.type, data.organization),
    });

    if (!organizationRecord) {
      return NextResponse.json("Organización no encontrada", { status: 400 });
    }

    const roleRecord = await db.query.roles.findFirst({
      where: eq(roles.type, data.role),
    });

    if (!roleRecord) {
      return NextResponse.json("Rol no encontrado", { status: 400 });
    }
    const newUserSuccess = await db.transaction(async (tx) => {
      let dataParser = { ...data, number: parseInt(data.number) };

      const addressUser = await tx
        .insert(addresses)
        .values({
          street: data?.street || "",
          number: dataParser?.number || null,
          intersectionOne: data?.intersectionOne || "",
          intersectionTwo: data?.intersectionTwo || "",
          province: data?.province || "",
          city: data?.city || "",
          postalCode: data?.postal_code || "",
        })
        .returning();

      if (!addressUser[0]?.id) {
        throw new Error("Error al crear address");
      }
      // Crear el nuevo usuario con los IDs de organización y rol
      const addressId = addressUser[0].id;
      const hashedPassword = await encrypt(data.password);
      const newUser = await tx
        .insert(users)
        .values({
          name: data.name || "",
          lastname: data.lastname || "",
          email: data.email || "",
          organizationId: organizationRecord.id,
          role: roleRecord.id,
          password: hashedPassword,
          addressId: addressId || null,
        })
        .returning();
      if (!newUser[0]?.id) {
        throw new Error("Error al crear el user");
      }
      return newUser[0];
    });

    // Verificar que newUser[0] no sea undefined
    if (newUserSuccess && newUserSuccess?.id) {
      const createdUser = newUserSuccess; // Garantizamos que el usuario existe

      // Excluir la contraseña de la respuesta
      const { password, ...userWithoutPassword } = createdUser;

      // Devolver el usuario sin la contraseña
      return NextResponse.json(userWithoutPassword, { status: 201 });
    }

    // Si por alguna razón no se crea el usuario
    return NextResponse.json("No se pudo crear el usuario", { status: 400 });
  } catch (error: any) {
    console.error("Error in POST /register:", error);
    return NextResponse.json("An unexpected error occurred.", {
      status: 500,
    });
  }
}
