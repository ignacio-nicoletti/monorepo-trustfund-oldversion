
import fs from "fs";
import path from "path";
import __dirname from "~/src/utils/dirname";
import {
  authorizeGoogleDrive,
  checkIfFolderIsEmpty,
  createOrFindFolder,
  deleteFileFromDrive,
  deleteFolderFromDrive,
  extractFileId,
  parseFormData,
  sanitizeFolderName,
  uploadFileToDrive,
} from "~/src/utils/uploadToDrive-functions";

export const runtime = "nodejs"; // Ensure that Node.js runtime is used

export async function uploadFile(request: any) {
  console.log(
    "-------------------------UPDATE FILE------------------------------------"
  );

  try {
    const formData = await parseFormData(request);
    const { fields, files } = formData;

    //@ts-ignore
    const folderUrl = fields.folderUrl || null;
    //@ts-ignore
    const documentType = fields.documentType || null;

    //@ts-ignore
    const warrantorName = fields.warrantorName || null;
     
    //@ts-ignore
    const fileName = warrantorName ? documentType + "-" + warrantorName : documentType

    //@ts-ignore
    const file = files.file;

    if (!folderUrl || !file || !documentType) {
      return "Missing folder URL/ID, file, document type, or warrantor type"
      }

    //@ts-ignore
    const sanitizedFolderName = sanitizeFolderName(fields.folderName);
    const folderId = folderUrl.includes("drive.google.com")
      ? extractFileId(folderUrl, "folder")
      : folderUrl;

    const auth = await authorizeGoogleDrive();

    // Create or find the main folder
    const mainFolderId = await createOrFindFolder(
      auth,
      sanitizedFolderName,
      folderId
    );

    // Check for "Reserva" in documentType to create subfolder structure
    let targetFolderId = mainFolderId;
    if (documentType.includes("Reserva")) {
      // Ensure Pagos folder
      const pagosFolderId = await createOrFindFolder(
        auth,
        "Pagos",
        mainFolderId
      );

      // Ensure Recibos folder inside Pagos
      const recibosFolderId = await createOrFindFolder(
        auth,
        "Recibos",
        pagosFolderId
      );

      // Set the final target folder for upload
      targetFolderId = recibosFolderId;
    }

     // Upload the file to the target folder
    const { fileId, webViewLink } = await uploadFileToDrive(
      auth,
      file,
      fileName,
      targetFolderId
    );
    return { fileId, folderId: mainFolderId, webViewLink};
  } catch (error: any) {
    console.error("Error en el servidor:", error);
    const outputDir = path.join(__dirname, "output");

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const errorOutput = path.join(outputDir, "driveError.txt");
    const errorMessage =
      typeof error === "object"
        ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        : String(error);
    fs.writeFileSync(errorOutput, errorMessage, "utf-8");
    console.error("Error al obtener datos de usuarios:", errorMessage);

    // Handle specific error for files that are too large
    if (error.message.includes("maxFileSize exceeded")) {
      return "El archivo es demasiado grande. Tamaño máximo permitido es 10 MB.";
    }

    return "Error al procesar la solicitud";
  }
}

export type UploadDrive = Awaited<ReturnType<typeof uploadFile>>;

export async function deleteFile (request: any){
  try {
    const { fileUrl, folderId } = await request.json();

    if (!fileUrl || !folderId) {
      return "La URL del archivo y el ID de la carpeta son requeridos"
    }

    // Extraer el ID del archivo desde la URL
    const fileId = extractFileId(fileUrl, "file");

    if (!fileId) {
      return "No se pudo extraer el ID del archivo de la URL proporcionada"
    }

    // Autenticar con Google Drive
    const auth = await authorizeGoogleDrive();

    // Eliminar el archivo de Google Drive
    await deleteFileFromDrive(auth, fileId);

    // Verificar si la carpeta está vacía y, si lo está, eliminarla
    const isFolderEmpty = await checkIfFolderIsEmpty(auth, folderId);

    if (isFolderEmpty) {
      await deleteFolderFromDrive(auth, folderId);
      return "Archivo y carpeta eliminados exitosamente" 
    }

    return "Archivo eliminado exitosamente"
  } catch (error: any) {
    console.error("Error en el servidor:", error);
    return "Error al procesar la solicitud de eliminación"
  }
}

export type DeleteFile = Awaited<ReturnType<typeof deleteFile>>;