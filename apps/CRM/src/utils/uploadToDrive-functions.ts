import { google } from "googleapis";
import { Readable } from "stream";

// !----------- POST ENDPOINT UTILS -----------------! //

export async function parseFormData(request: any) {
  console.log("----------PARSEANDO FORM-----------");

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.startsWith("multipart/form-data")) {
      const formData = await request.formData();
      const fields = {};
      const files = {};

      for (const [key, value] of formData.entries()) {
        if (typeof value === "object" && typeof value.arrayBuffer === "function") {
          // Handle file uploads
          const fileData = Buffer.from(await value.arrayBuffer());

          // Enforce max file size of 10 MB
          const maxFileSize = 10 * 1024 * 1024; // 10 MB
          if (fileData.length > maxFileSize) {
            throw new Error(`Solicitud: tamaño del archivo excedido (10MB máximo)`);
          }
          //@ts-ignore
          files[key] = {
            buffer: fileData,
            originalFilename: value.name,
            mimetype: value.type,
            size: fileData.length,
          };
        } else {
          //@ts-ignore
          fields[key] = value;
        }
      }

      console.log("----------SUCCESSS PARSEFORM--------");
      return { fields, files };
    } else {
      throw new Error("Solicitud: tipo de archivo no soportado");
    }
  } catch (error: any) {
    console.error("Error parsing form data:", error);
    throw Error(error.message);
  }
}

export async function authorizeGoogleDrive() {
  console.log("----------init authorizeGoogleDrive--------");
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    undefined,
    process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
    SCOPES
  );

  await auth.authorize();
  console.log("----------finish authorizeGoogleDrive--------");
  return auth;
}

// Function to escape special characters in the folder name
export function escapeQueryParam(param: any) {
  return param.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// Function to sanitize the folder name
export function sanitizeFolderName(name: any) {
  console.log("----------init sanitizeFolderName--------");
  // Remove leading and trailing whitespace
  let sanitized = name.trim();

  // Replace multiple spaces with a single space
  sanitized = sanitized.replace(/\s+/g, " ");

  // Escape special characters for the query
  sanitized = escapeQueryParam(sanitized);
  console.log("----------finish sanitizeFolderName--------");
  return sanitized;
}

export async function createOrFindFolder(auth: any, folderName: any, parentFolderId: any) {
  console.log("----------init createOrFindFolder--------");
  const drive = google.drive({ version: "v3", auth });

  // Build the query, ensuring to escape the folder name
  const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`;

  const res = await drive.files.list({
    q: query,
    fields: "files(id, name)",
    spaces: "drive",
  });

  if (res.data.files && res.data.files.length > 0) {
    // The folder exists
    console.log("----------finish finding folder createOrFindFolder--------");
    return res.data.files[0]?.id;
  } else {
    // Create the folder
    const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });

    console.log("----------finish creating createOrFindFolder--------");
    return folder.data.id;
  }
}

export async function uploadFileToDrive(auth: any, file: any, fileName: string, folderId: any) {
  console.log("----------init uploadFileToDrive--------");
  const drive = google.drive({ version: "v3", auth });

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };
  // Request 'id' and 'webViewLink' fields
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink, name",
  });

  const fileId = res.data.id;
  const webViewLink = res.data.webViewLink;
  const name = res.data.name;

  console.log("----------finish uploadFileToDrive--------");
  return { fileId, webViewLink, name };
}

// !----------- POST ENDPOINT UTILS -----------------! //

// !----------- DELETE ENDPOINT UTILS -----------------! //

// Función para extraer el ID del archivo desde la URL
export function extractFileId(fileUrl: string, type: string): string | null {
  console.log("------------------------ Init extractFile -----------------------------", fileUrl);

  const match = fileUrl.split("/");
  console.log("------------------------ Finish extractFile -----------------------------", match);
  return match?.length
    ? type === "file"
      ? match[match.length - 2]!
      : match[match.length - 1]!
    : null;
}

// Función para eliminar el archivo de Google Drive
export async function deleteFileFromDrive(auth: any, fileId: string): Promise<void> {
  console.log("------------------------Init deleteFileFromDrive -----------------------------");
  const drive = google.drive({ version: "v3", auth });
  console.log("------------------------Finish deleteFileFromDrive -----------------------------");
  await drive.files.delete({ fileId });
}

// Función para verificar si la carpeta está vacía
export async function checkIfFolderIsEmpty(auth: any, folderId: string): Promise<boolean> {
  console.log("------------------------Init checkIfFolderIsEmpty -----------------------------");
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "files(id)",
    pageSize: 1, // Solo necesitamos saber si existe algún archivo
  });

  console.log("------------------------End checkIfFolderIsEmpty -----------------------------");

  return res.data.files?.length === 0;
}

// Función para eliminar la carpeta de Google Drive
export async function deleteFolderFromDrive(auth: any, folderId: string): Promise<void> {
  console.log("------------------------Init deleteFolderFromDrive -----------------------------");
  const drive = google.drive({ version: "v3", auth });
  await drive.files.delete({ fileId: folderId });
  console.log("------------------------Finish deleteFolderFromDrive -----------------------------");
  return;
}

// !----------- DELETE ENDPOINT UTILS -----------------! //

// !----------- DELETE ALL FOLDER -----------------! //

// // Función para eliminar todos los archivos dentro de una carpeta (y carpetas recursivas)
async function deleteFilesInFolder(auth: any, folderId: string): Promise<void> {
  const drive = google.drive({ version: "v3", auth });

  // Listar todos los archivos dentro de la carpeta
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "files(id, mimeType)",
  });

  for (const file of res.data.files || []) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      // Si el archivo es una carpeta, llamamos a la función recursiva
      await deleteFolderAndContents(auth, file.id!);
    } else {
      // Si el archivo es un archivo normal, lo eliminamos
      await deleteFileFromDrive(auth, file.id!);
    }
  }
}

// // Función recursiva para eliminar una carpeta y su contenido
export async function deleteFolderAndContents(auth: any, folderId: string): Promise<void> {
  const drive = google.drive({ version: "v3", auth });

  console.log(`Eliminando contenido de la carpeta ${folderId}...`);

  // Eliminar primero los archivos dentro de la carpeta
  await deleteFilesInFolder(auth, folderId);

  // Luego verificamos si la carpeta está vacía
  const isEmpty = await checkIfFolderIsEmpty(auth, folderId);
  if (isEmpty) {
    // Si la carpeta está vacía, la eliminamos
    console.log(`Eliminando la carpeta vacía ${folderId}...`);
    await drive.files.delete({ fileId: folderId });
  }

  console.log(`Carpeta eliminada o ya vacía ${folderId}`);
}

export async function checkFileExists(auth: any, fileId: string): Promise<boolean> {
  try {
    const drive = google.drive({ version: "v3", auth });
    // Intenta obtener el archivo por su ID
    await drive.files.get({
      fileId: fileId,
      fields: "id", // Solo solicitamos el ID del archivo
    });
    return true; // Si no ocurre error, el archivo existe
  } catch (error: any) {
    if (error?.code === 404) {
      // Si el error es 404, significa que el archivo no se encuentra
      console.log("Archivo no encontrado.");
      return false; // El archivo no existe
    }
    throw error; // Lanza otros errores si ocurren
  }
}
