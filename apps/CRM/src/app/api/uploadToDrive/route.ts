// app/api/uploadToDrive/route.js

import { NextRequest, NextResponse } from "next/server";
import __dirname from "~/src/utils/dirname";
import {
  authorizeGoogleDrive,
  checkIfFolderIsEmpty,
  createOrFindFolder,
  deleteFileFromDrive,
  deleteFolderAndContents,
  deleteFolderFromDrive,
  extractFileId,
  parseFormData,
  sanitizeFolderName,
  uploadFileToDrive,
} from "~/src/utils/uploadToDrive-functions";
import db, {
  and,
  documents,
  eq,
  quotas,
  warranties,
  warrantors,
} from "@repo/database/db";
import { InferDocument } from "@repo/database/types";
import requestQueue from "~/src/utils/RequestQueue/RequestQueue";

export const runtime = "nodejs"; // Ensure that Node.js runtime is used

export function POST(request: NextRequest): Promise<NextResponse> {
  return new Promise((resolve) => {
    requestQueue.enqueue(async () => {
      const response = await handlePostRequest(request);
      resolve(response);
    });
  });
}

async function handlePostRequest(request: NextRequest): Promise<NextResponse> {
  console.log(
    "-------------------------UPLOAD FILE------------------------------------"
  );

  try {
    const formData = await parseFormData(request);
    const { fields, files }: any = formData;

    // Type assertions
    const folderUrl = fields.folderUrl as string | null;
    const driveFolderId = fields.driveFolderId as string | null;
    const documentType = fields.documentType as string | null;
    const documentId = fields.documentId as string | null;
    const warrantorId = fields.warrantorId as string | null;
    const warrantyId = fields.warrantyId as string | null;
    const quotaId = fields.quotaId as string | null;
    const warrantorName = fields.warrantorName as string | null;
    const fileName = warrantorName
      ? `${documentType}-${warrantorName}`
      : documentType;
    const file = files.file;

    if ((!driveFolderId && !folderUrl) || !file || !documentType) {
      return NextResponse.json(
        {
          error:
            "Missing folder URL/ID, file, document type, or warrantor type",
        },
        { status: 400 }
      );
    }

    const sanitizedFolderName = sanitizeFolderName(fields.folderName as string);
    const folderId =
      folderUrl && folderUrl.includes("drive.google.com")
        ? extractFileId(folderUrl, "folder")
        : folderUrl;

    const auth = await authorizeGoogleDrive();

    // Create or find the main folder
    const mainFolderId = folderUrl
      ? await createOrFindFolder(auth, sanitizedFolderName, folderId)
      : driveFolderId;

    // Handle subfolders and upload logic
    let targetFolderId = mainFolderId;
    if (
      documentType.includes("Reserva") ||
      documentType.includes("Recibo") ||
      documentType.includes("Comprobante")
    ) {
      const pagosFolderId = await createOrFindFolder(
        auth,
        "Pagos",
        mainFolderId
      );
      const recibosFolderId = await createOrFindFolder(
        auth,
        "Recibos",
        pagosFolderId
      );
      targetFolderId = recibosFolderId;
    }

    // Upload the file to the target folder
    const { fileId, webViewLink, name } = await uploadFileToDrive(
      auth,
      file,
      fileName as string,
      targetFolderId
    );

    if (warrantorId) {
      const warrantorToUpdate = await db
        .select({
          id: warrantors.id,
          driveFolderId: warrantors.driveFolderId,
          isRequester: warrantors.isRequester,
          warrantyId: warrantors.warrantyId,
        })
        .from(warrantors)
        .where(eq(warrantors.id, warrantorId));

      //Si el garante que encuentro no es solicitante, tengo que agregar el drive folder id igual, y no uso el warranty id porque estoy chequeando si me llega para agregar archivos a la garantia
      if (warrantorToUpdate?.length && !warrantorToUpdate[0]?.isRequester) {
        let requester = await db
          .select({
            id: warrantors.id,
            driveFolderId: warrantors.driveFolderId,
            isRequester: warrantors.isRequester,
            warrantyId: warrantors.warrantyId,
          })
          .from(warrantors)
          .where(
            and(
              eq(warrantors.warrantyId, warrantorToUpdate[0]?.warrantyId!),
              eq(warrantors.isRequester, true)
            )
          );

        if (requester?.length && !requester[0]?.driveFolderId) {
          const updatedWarrantor = await db
            .update(warrantors)
            .set({ driveFolderId: mainFolderId })
            .where(eq(warrantors.id, requester[0]?.id!))
            .returning();
          if (!updatedWarrantor[0]?.id) {
            console.log("No se pudo actualizar al solicitante");
          }
        }
      }

      if (
        warrantorToUpdate.length &&
        warrantorToUpdate[0]?.isRequester &&
        !warrantorToUpdate[0].driveFolderId
      ) {
        const updatedWarrantor = await db
          .update(warrantors)
          .set({ driveFolderId: mainFolderId })
          .where(eq(warrantors.id, warrantorId))
          .returning();
        if (!updatedWarrantor[0]?.id) {
          console.log("No se pudo actualizar al solicitante");
        }
      }
    }

    let newDoc: InferDocument[] = [];
    if (warrantyId) {
      newDoc = await db
        .insert(documents)
        .values({
          url: webViewLink,
          name: name,
          warrantyDocumentTypesId: Number(documentId),
          warrantyId: warrantyId,
        })
        .returning();
    } else if (quotaId) {
      let setter = documentType.includes("Comprobante")
        ? { proofPayment: webViewLink }
        : { receiptPayment: webViewLink };
      let quotaUpdate = await db
        .update(quotas)
        .set(setter)
        .where(eq(quotas.id, quotaId))
        .returning();
    } else {
      newDoc = await db
        .insert(documents)
        .values({
          url: webViewLink,
          name: name,
          warrantorDocumentTypesId: Number(documentId),
          warrantorId: warrantorId,
        })
        .returning();
    }

    if (newDoc[0]?.id) {
      return NextResponse.json(
        {
          fileId,
          folderId: mainFolderId,
          webViewLink,
          name,
          dbId: newDoc[0].id,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { fileId, folderId: mainFolderId, webViewLink, name },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error en el servidor:", err);

    // Handle specific error for files that are too large
    if (err.message.includes("maxFileSize exceeded")) {
      return NextResponse.json(
        {
          error:
            "El archivo es demasiado grande. Tamaño máximo permitido es 10 MB.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

export function PUT(request: NextRequest): Promise<NextResponse> {
  return new Promise((resolve) => {
    requestQueue.enqueue(async () => {
      const response = await handlePutRequest(request);
      resolve(response);
    });
  });
}

async function handlePutRequest(request: NextRequest): Promise<NextResponse> {
  try {
    const { fileUrl, folderId, dbId, quotaId, type } = await request.json();

    if (!fileUrl || !folderId) {
      return NextResponse.json(
        { error: "La URL del archivo y el ID de la carpeta son requeridos" },
        { status: 400 }
      );
    }

    const fileId = extractFileId(fileUrl, "file");

    if (!fileId) {
      return NextResponse.json(
        {
          error: "No se pudo extraer el ID del archivo de la URL proporcionada",
        },
        { status: 400 }
      );
    }

    const auth = await authorizeGoogleDrive();

    await deleteFileFromDrive(auth, fileId);

    const isFolderEmpty = await checkIfFolderIsEmpty(auth, folderId);
    let deletedFromDB = false;

    if (quotaId) {
      if (type.includes("Comprobante")) {
        let updateCuota = await db
          .update(quotas)
          .set({ proofPayment: null })
          .where(eq(quotas.id, quotaId))
          .returning();
        console.log(
          updateCuota[0]?.id
            ? "Cuota Actualizada"
            : "Fallo la actualizacion de la cuota"
        );
      } else if (type.includes("Recibo")) {
        let updateCuota = await db
          .update(quotas)
          .set({ receiptPayment: null })
          .where(eq(quotas.id, quotaId))
          .returning();
        console.log(
          updateCuota[0]?.id
            ? "Cuota Actualizada"
            : "Fallo la actualizacion de la cuota"
        );
      }
    }

    if (dbId?.length) {
      const documentToDelete = await db
        .delete(documents)
        .where(eq(documents.id, dbId))
        .returning();
      if (documentToDelete[0]?.id) {
        deletedFromDB = true;
      }
    }

    if (isFolderEmpty) {
      await deleteFolderFromDrive(auth, folderId);
      return NextResponse.json(
        {
          message: deletedFromDB
            ? "Archivo eliminado de drive y db, carpeta eliminada exitosamente"
            : "Archivo y carpeta eliminados exitosamente",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: deletedFromDB
          ? "Archivo eliminado de drive y de la base de datos"
          : "Archivo eliminado exitosamente",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error en el servidor:", err);
    return NextResponse.json(
      { error: "Error al procesar la solicitud de eliminación" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { fileUrl, folderId, dbId, warrantyId } = await request.json();

    // Cambio a cerrado perdida la garantia
    await db
      .update(warranties)
      .set({ statusWarrantyId: 8 })
      .where(eq(warranties.id, warrantyId));

    if (!fileUrl || !folderId) {
      return NextResponse.json(
        { error: "La URL del archivo y el ID de la carpeta son requeridos" },
        { status: 400 }
      );
    }

    const fileId = extractFileId(fileUrl, "file");

    if (!fileId) {
      return NextResponse.json(
        {
          error: "No se pudo extraer el ID del archivo de la URL proporcionada",
        },
        { status: 400 }
      );
    }

    let deletedFromDB = false;
    if (dbId?.length) {
      const result = await db
        .delete(documents)
        .where(eq(documents.id, dbId))
        .returning();
      if (result.length > 0) {
        deletedFromDB = true;
      }
    }

    // Elimina la carpeta del drive y archivo
    const auth = await authorizeGoogleDrive();
    await deleteFolderAndContents(auth, folderId);

    return NextResponse.json(
      {
        message: deletedFromDB
          ? "Archivo eliminado de Drive y DB, carpeta eliminada exitosamente"
          : "Archivo eliminado exitosamente de Drive",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en el servidor:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud de eliminación" },
      { status: 500 }
    );
  }
}

// export async function PUT(request: NextRequest): Promise<NextResponse> {
//   try {
//     const { fileUrl, folderId, dbId } = await request.json();

//     if (!fileUrl || !folderId) {
//       return NextResponse.json(
//         { error: "La URL del archivo y el ID de la carpeta son requeridos" },
//         { status: 400 }
//       );
//     }

//     // Extraer el ID del archivo desde la URL
//     const fileId = extractFileId(fileUrl, "file");

//     if (!fileId) {
//       return NextResponse.json(
//         {
//           error: "No se pudo extraer el ID del archivo de la URL proporcionada",
//         },
//         { status: 400 }
//       );
//     }

//     // Autenticar con Google Drive
//     const auth = await authorizeGoogleDrive();

//     // Eliminar el archivo de Google Drive
//     await deleteFileFromDrive(auth, fileId);

//     // Verificar si la carpeta está vacía y, si lo está, eliminarla
//     const isFolderEmpty = await checkIfFolderIsEmpty(auth, folderId);
//     let deletedFromDB = false;

//     if (dbId?.length) {
//       let documentToDelete = await db.delete(documents).where(eq(documents.id, dbId)).returning();
//       if (documentToDelete[0]?.id) {
//         deletedFromDB = true;
//       }
//     }
//     if (isFolderEmpty) {
//       await deleteFolderFromDrive(auth, folderId);
//       return NextResponse.json(
//         {
//           message: deletedFromDB
//             ? "Archivo eliminado de drive y db, carpeta eliminada exitosamente"
//             : "Archivo y carpeta eliminados exitosamente",
//         },
//         { status: 200 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: deletedFromDB
//           ? "Archivo eliminado de drive y de la base de datos"
//           : "Archivo eliminado exitosamente",
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error en el servidor:", error);
//     return NextResponse.json(
//       { error: "Error al procesar la solicitud de eliminación" },
//       { status: 500 }
//     );
//   }
// }

// ---------------------------------------------------------------------------------------------------------

// export async function POST(request: NextRequest) {
//   console.log("-------------------------UPDATE FILE------------------------------------");

//   try {
//     const formData = await parseFormData(request);
//     const { fields, files } = formData;
//     // TODO: recibir Id del garante solicitante para agregarle el driveFolderId si no lo tiene
//     // TODO: recibir warrantyId y con eso crear doc con warrantyId y warrantyDocumentType

//     //@ts-ignore
//     const folderUrl = fields.folderUrl || null;
//     //@ts-ignore
//     const documentType = fields.documentType || null;
//     //@ts-ignore
//     const documentId = fields.documentId || null;

//     //@ts-ignore
//     const warrantorId = fields.warrantorId || null;
//     //@ts-ignore
//     const warrantyId = fields.warrantyId || null;

//     //@ts-ignore
//     const warrantorName = fields.warrantorName || null;

//     //@ts-ignore
//     const fileName = warrantorName ? documentType + "-" + warrantorName : documentType;

//     //@ts-ignore
//     const file = files.file;

//     if (!folderUrl || !file || !documentType) {
//       return NextResponse.json(
//         {
//           error: "Missing folder URL/ID, file, document type, or warrantor type",
//         },
//         { status: 400 }
//       );
//     }

//     //@ts-ignore
//     const sanitizedFolderName = sanitizeFolderName(fields.folderName);
//     const folderId = folderUrl.includes("drive.google.com")
//       ? extractFileId(folderUrl, "folder")
//       : folderUrl;

//     const auth = await authorizeGoogleDrive();

//     // Create or find the main folder
//     const mainFolderId = await createOrFindFolder(auth, sanitizedFolderName, folderId);

//     // Check for "Reserva" in documentType to create subfolder structure
//     let targetFolderId = mainFolderId;
//     if (documentType.includes("Reserva")) {
//       // Ensure Pagos folder
//       const pagosFolderId = await createOrFindFolder(auth, "Pagos", mainFolderId);

//       // Ensure Recibos folder inside Pagos
//       const recibosFolderId = await createOrFindFolder(auth, "Recibos", pagosFolderId);

//       // Set the final target folder for upload
//       targetFolderId = recibosFolderId;
//     }

//     // Upload the file to the target folder
//     const { fileId, webViewLink, name } = await uploadFileToDrive(
//       auth,
//       file,
//       fileName,
//       targetFolderId
//     );

//     if (warrantorId) {
//       let warrantorToUpdate = await db
//         .select({
//           id: warrantors.id,
//           driveFolderId: warrantors.driveFolderId,
//           isRequester: warrantors.isRequester,
//         })
//         .from(warrantors)
//         .where(eq(warrantors.id, warrantorId));

//       if (
//         warrantorToUpdate.length &&
//         warrantorToUpdate[0]?.isRequester &&
//         !warrantorToUpdate[0].driveFolderId
//       ) {
//         let updatedWarrantor = await db
//           .update(warrantors)
//           .set({ driveFolderId: mainFolderId })
//           .where(eq(warrantors.id, warrantorId))
//           .returning();
//         if (!updatedWarrantor[0]?.id) {
//           console.log("No se pudo actualizar al solicitante");
//         }
//       }
//     }

//     let newDoc: any = [];
//     if (warrantyId) {
//       newDoc = await db
//         .insert(documents)
//         .values({
//           url: webViewLink,
//           name: name,
//           warrantyDocumentTypesId: Number(documentId),
//           warrantyId: warrantyId,
//         })
//         .returning();
//     } else {
//       newDoc = await db
//         .insert(documents)
//         .values({
//           url: webViewLink,
//           name: name,
//           warrantorDocumentTypesId: Number(documentId),
//           warrantorId: warrantorId,
//         })
//         .returning();
//     }

//     if (newDoc[0]?.id) {
//       //TODO: agregar el mainFolderId al warrantor isRequester
//       return NextResponse.json(
//         {
//           fileId,
//           folderId: mainFolderId,
//           webViewLink,
//           name,
//           dbId: newDoc[0].id,
//         },
//         { status: 200 }
//       );
//     }
//     return NextResponse.json(
//       { fileId, folderId: mainFolderId, webViewLink, name },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error en el servidor:", error);
//     const outputDir = path.join(__dirname, "output");

//     // Ensure the output directory exists
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir, { recursive: true });
//     }
//     const errorOutput = path.join(outputDir, "driveError.txt");
//     const errorMessage =
//       typeof error === "object"
//         ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
//         : String(error);
//     fs.writeFileSync(errorOutput, errorMessage, "utf-8");
//     console.error("Error al obtener datos de usuarios:", errorMessage);

//     // Handle specific error for files that are too large
//     if (error.message.includes("maxFileSize exceeded")) {
//       return NextResponse.json(
//         {
//           error: "El archivo es demasiado grande. Tamaño máximo permitido es 10 MB.",
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
//   }
