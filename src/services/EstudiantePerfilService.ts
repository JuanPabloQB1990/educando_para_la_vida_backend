import EstudianteRepository from '../repositories/EstudianteRepository';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { uploadHelper, deleteFileFromDrive } from '../utils/uploadFIleToGoogleDrive';
import { AppError } from '../error/AppError';

type FileField = 'file_foto' | 'file_doc' | 'file_diagnostico' | 'padre_file' | 'madre_file' | 'acudiente_file';
const FILE_FIELDS: readonly string[] = ['file_foto', 'file_doc', 'file_diagnostico', 'padre_file', 'madre_file', 'acudiente_file'];
const USUARIO_FIELDS = ['nombres', 'apellido1', 'apellido2', 'contacto1', 'contacto2', 'email', 'id_tipo_documento', 'no_documento', 'fecha_expedicion_documento'];

function extractDriveFileId(url: string): string | null {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

class EstudiantePerfilService {
  async getPerfil(idUsuario: string) {
    const data = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!data) throw new AppError(404, 'Perfil de estudiante no encontrado');
    return data;
  }

  async updatePerfil(idUsuario: string, body: Record<string, unknown>) {
    const existing: any = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!existing) throw new AppError(404, 'Perfil de estudiante no encontrado');

    const usuarioPayload: Record<string, unknown> = {};
    const estudiantePayload: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(body)) {
      if (FILE_FIELDS.includes(key)) continue;
      if (USUARIO_FIELDS.includes(key)) {
        usuarioPayload[key] = val;
      } else {
        estudiantePayload[key] = val;
      }
    }

    if (Object.keys(usuarioPayload).length > 0) {
      const merged = {
        nombres: existing.usuarioNombres,
        apellido1: existing.usuarioApellido1,
        apellido2: existing.usuarioApellido2,
        contacto1: existing.usuarioContacto1,
        contacto2: existing.usuarioContacto2,
        email: existing.usuarioEmail,
        id_rol: existing.usuarioIdRol,
        estado: existing.usuarioEstado,
        id_tipo_documento: existing.usuarioIdTipoDocumento,
        no_documento: existing.usuarioNoDocumento,
        fecha_expedicion_documento: existing.usuarioFechaExpedicionDocumento,
        ...usuarioPayload,
      };
      await UsuarioRepository.update(existing.idUsuario, merged);
    }

    if (Object.keys(estudiantePayload).length > 0) {
      await EstudianteRepository.update(existing.id, estudiantePayload);
    }

    return await EstudianteRepository.findByIdUsuario(idUsuario);
  }

  async updateArchivo(idUsuario: string, campo: string, file: Express.Multer.File) {
    if (!FILE_FIELDS.includes(campo)) throw new AppError(400, 'Campo de archivo no válido');

    const existing: any = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!existing) throw new AppError(404, 'Perfil de estudiante no encontrado');

    const camelKey = snakeToCamel(campo);
    const oldUrl: string | null = existing[camelKey] ?? null;

    if (oldUrl) {
      const fileId = extractDriveFileId(oldUrl);
      if (fileId) {
        await deleteFileFromDrive(fileId).catch(() => {});
      }
    }

    const studentName = `${existing.usuarioNombres ?? ''} ${existing.usuarioApellido1 ?? ''}`.trim();
    const docNumber = existing.usuarioNoDocumento ?? 'SN';
    const url = await uploadHelper(file, campo, studentName, docNumber);
    if (!url) throw new AppError(500, 'Error al subir el archivo a Drive');

    await EstudianteRepository.updateArchivo(existing.id, campo, url);
    return await EstudianteRepository.findByIdUsuario(idUsuario);
  }
}

export default new EstudiantePerfilService();
