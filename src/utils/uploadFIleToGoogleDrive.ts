import { google } from "googleapis";
import path from "path";
import { Readable } from "stream";
import { config } from "../config/environment";
import type { Express } from "express";

// 1. Inicializar el cliente OAuth2 mapeando tus variables de entorno (.env)
const oauth2Client = new google.auth.OAuth2(
  config.googleClientId,
  config.googleClientSecret,
  "https://developers.google.com/oauthplayground" // La URI de redirección usada en la consola
);

// 2. Inyectar el Refresh Token eterno para que autorenueve los accesos de Node.js

oauth2Client.setCredentials({
  refresh_token: config.googleRefreshToken,
});

// 3. Crear la instancia de Drive vinculada a tu cuenta personal
const drive = google.drive({ version: "v3", auth: oauth2Client });

interface UploadParams {
  file: any;
  studentName: string;
  documentNumber: string;
  fileType: string;
  FOLDER_ID: string;
}

export async function uploadFileToDrive({ file, studentName, documentNumber, fileType, FOLDER_ID }: UploadParams) {
  if (!file) return null;

  // Formatear nombre del archivo
  const formattedName = studentName.trim().replace(/\s+/g, "_");
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const extension = path.extname(file.originalname);
  const fileName = `${formattedName}-${documentNumber}-${date}-${fileType}${extension}`;

  // Convertir el buffer del archivo en Stream legible por Google API
  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);

  try {
    // Tomar el ID de la carpeta desde el .env (o dejar el tuyo como fallback por seguridad)
    
    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID], 
    };

    const media = {
      mimeType: file.mimetype,
      body: bufferStream,
    };

    // Subir el archivo de manera directa a nombre de tu cuenta personal
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    // Retorna el enlace directo para almacenar en la base de datos MySQL
    return response.data.webViewLink;
  } catch (error) {
    console.error("Error al subir archivo a Google Drive mediante OAuth2:", error);
    throw error;
  }
}

export const uploadHelper = async (file: any, fileType: string, studentName: string, documentNumber: string, FOLDER_ID: string) => {
  return await uploadFileToDrive({
    file,
    studentName,
    documentNumber,
    fileType,
    FOLDER_ID,
  });
};

export async function uploadClassroomFile(file: Express.Multer.File): Promise<{ url: string; nombre: string }> {
  const FOLDER_CLASSROOM_ID = config.googleDriveFolderClassroomId;
  const ext = path.extname(file.originalname).toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `classroom-${date}-${baseName}${ext}`;

  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);

  const response = await drive.files.create({
    requestBody: { name: fileName, parents: [FOLDER_CLASSROOM_ID] },
    media: { mimeType: file.mimetype, body: bufferStream },
    fields: 'id, webViewLink',
  });

  if (!response.data.webViewLink) {
    throw new Error('No se pudo obtener el enlace del archivo subido a Drive');
  }

  return { url: response.data.webViewLink, nombre: fileName };
}

export async function deleteFileFromDrive(fileId: string): Promise<void> {
  await drive.files.delete({ fileId });
}