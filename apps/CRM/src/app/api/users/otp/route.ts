import { NextResponse, NextRequest } from "next/server";
import db, { and, eq, OTPs, users } from "@repo/database/db";
import { checkExpirationTime } from "~/src/utils/OTP";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const otp = searchParams.get("otp");
  const email = searchParams.get("email");

  try {
    if (!otp || !email) {
      return NextResponse.json(
        {
          message: "Faltan parametros",
        },
        {
          status: 400,
        }
      );
    }

    const userFound = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userFound.length === 0) {
      return NextResponse.json(
        {
          message: "El usuario no existe",
        },
        {
          status: 404,
        }
      );
    }

    let otpParsed = Number(otp);

    const otpFound = await db
      .select()
      .from(OTPs)
      .where(and(eq(OTPs.email, email), eq(OTPs.otp, otpParsed)))
      .limit(1);

    if (otpFound.length > 0) {
      const otpId = otpFound[0]?.id;
      if (!otpId) {
        throw new Error("Invalid OTP record: missing ID");
      }
    }

    if (otpFound[0]?.id) {
      const timezone = "America/Argentina/Buenos_Aires";
      let validOTP = checkExpirationTime(timezone, otpFound[0]?.expirationAt!);

      if (!validOTP) {
        return NextResponse.json(
          {
            message: "El OTP ingresado ha expirado",
          },
          {
            status: 400,
          }
        );
      }
    }

    return NextResponse.json(otpFound);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.otp || !data.expirationAt || !data.email) {
      return NextResponse.json(
        {
          message: "Faltan parámetros",
        },
        {
          status: 404,
        }
      );
    }

    const otpParsed = Number(data.otp);

    const userFound = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

    if (userFound.length === 0) {
      return NextResponse.json(
        {
          message: "El usuario no existe",
        },
        {
          status: 404,
        }
      );
    }

    const userId = userFound[0]?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message: "Error: userId is undefined",
        },
        {
          status: 500,
        }
      );
    }

    const otpFound = await db.select().from(OTPs).where(eq(OTPs.email, data.email)).limit(1);

    if (otpFound.length > 0) {
      const otpId = otpFound[0]?.id;
      if (!otpId) {
        throw new Error("Invalid OTP record: missing ID");
      }

      // Update the existing OTP record
      const otpUpdated = await db
        .update(OTPs)
        .set({ otp: otpParsed, expirationAt: data.expirationAt })
        .where(eq(OTPs.id, otpId))
        .returning();

      return NextResponse.json(otpUpdated);
    } else {
      // Create a new OTP record
      const newOTP = await db
        .insert(OTPs)
        .values({
          otp: otpParsed,
          expirationAt: data.expirationAt,
          email: data.email,
          userId: userId,
        })
        .returning();

      return NextResponse.json(newOTP);
    }
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.otp || !data.expirationAt || !data.email) {
      return NextResponse.json(
        {
          message: "Faltan parámetros",
        },
        {
          status: 404,
        }
      );
    }

    let otpParsed = Number(data.otp);

    const userFound = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

    if (userFound.length === 0) {
      return NextResponse.json(
        {
          message: "El usuario no existe",
        },
        {
          status: 404,
        }
      );
    }

    const otpFound = await db.select().from(OTPs).where(eq(OTPs.email, data.email)).limit(1);

    if (otpFound[0]?.id) {
      const otpUpdated = await db
        .update(OTPs)
        .set({ otp: otpParsed, expirationAt: data.expirationAt })
        .where(eq(OTPs.id, otpFound[0].id))
        .returning();

      return NextResponse.json(otpUpdated);
    } else {
      return NextResponse.json(
        {
          message: "OTP no existe",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const otpId = searchParams.get("otp");
  try {
    if (!otpId) {
      return NextResponse.json(
        {
          message: "Faltan parámetros",
        },
        {
          status: 404,
        }
      );
    }

    const otpFound = await db.select().from(OTPs).where(eq(OTPs.id, otpId)).limit(1);

    if (otpFound[0]?.id) {
      await db.delete(OTPs).where(eq(OTPs.id, otpFound[0].id));

      return NextResponse.json("OTP eliminado");
    } else {
      return NextResponse.json(
        {
          message: "OTP no existe",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
