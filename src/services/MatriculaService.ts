import { GradoMatriculaEstado } from "../enums/gradosPorMatricula.enum";
import { ObligacionPagoEstado } from "../enums/obligacionPago.enum";
import { PagoEstado } from "../enums/pago.enum";
import UsuarioRepository from "../repositories/UsuarioRepository";
import { FormularioMatriculaSchema } from "../types";
import { generatePrimaryKey } from "../utils/generatePrimaryKey";
import { EmailService } from "../utils/sendEmail";
import { uploadFileToS3 } from "../utils/uploadFIleAWSS3";
import EstudiantePeriodoService from "./EstudiantePeriodoService";
import EstudianteService from "./EstudianteService";
import GradosPorMatriculaService from "./GradosPorMatriculaService";
import ObligacionPagoService from "./ObligacionPagoService";
import PagoService from "./PagoService";
import RolService from "./RolService";
import RubroService from "./RubroService";
import UsuarioService from "./UsuarioService";



class MatriculaService {
 
  async create(form: FormularioMatriculaSchema) {
    const no_documento = form.no_documento ?? form.no_documento ?? null;
    // obtener id del rol 'estudiante' desde la tabla rol
    const rol = await RolService.findByName("estudiante");
    const id_rol = rol?.idRol;

    const user = await UsuarioRepository.findByDocumento(no_documento, id_rol);
      console.log(user);
      
    if (user) return { exists: true };

    // No existe: proceder a crear usuario y estudiante.
    // Aseguramos que el payload tenga el rol de estudiante
    const payload = { ...form, id_rol };

    // =========================
    // SUBIR ARCHIVOS A S3
    // =========================

    const payloadFiles = {
      file_doc: await uploadFileToS3(payload.file_doc),

      file_foto: await uploadFileToS3(payload.file_foto),

      file_compromiso: await uploadFileToS3(payload.file_compromiso),

      padre_file: await uploadFileToS3(payload.padre_file),

      madre_file: await uploadFileToS3(payload.madre_file),

      acudiente_file: await uploadFileToS3(payload.acudiente_file),

      // nullable
      file_diagnostico: payload.file_diagnostico
        ? await uploadFileToS3(payload.file_diagnostico)
        : null,

      file_certificado_grados: await uploadFileToS3(
        payload.file_certificado_grados,
      ),

      file_comprobante_pago: await uploadFileToS3(
        payload.file_comprobante_pago,
      ),
    };

    // Accept nested payloads: { usuario: {...}, estudiante: {...} } or flat
    let usuarioPayload = {};

    // If usuario nested object not provided, pick top-level usuario fields from data
    if (!usuarioPayload || Object.keys(usuarioPayload).length === 0) {
      const possibleKeys = [
        "nombres",
        "apellido1",
        "apellido2",
        "contacto1",
        "contacto2",
        "email",
        "id_rol",
        "id_tipo_documento",
        "no_documento",
        "fecha_expedicion_documento",
      ];

      usuarioPayload = {};

      for (const k of possibleKeys) {
        if (k in payload) (usuarioPayload as any)[k] = (payload as any)[k];
      }
    }

    // Crear usuario via UsuarioService y obtener id_usuario creado
    const userResult: { plainPassword: string; id: string } | null = await UsuarioService.create(usuarioPayload);
    console.log('id para crear estudiante:', userResult);

    const id_usuario = userResult.id;

    // Build payload for estudiante repository. EstudianteRepository expects `id_usuario` snake_case
    const payloadToCreateStudent = {
      id_usuario,
      ...payload,
      ...payloadFiles,
    };
    // crear registro en estudiante con id_usuario recién creado, obtener id_estudiante
    const idEstudiante = await EstudianteService.create(payloadToCreateStudent);
    console.log('id estudiante: ' + idEstudiante);
    
    // crear registro en estudiante_periodo con id_estudiante recién creado

    let EstudiantePeriodo = {
      id_estudiante_periodo: generatePrimaryKey(),
      id_estudiante: idEstudiante,
      id_tipo_estudio: payload.id_tipo_estudio || null,
      id_tiempo_validacion: payload.id_tiempo_validacion || null,
      fecha_inscripcion: new Date(),
      file_certificado_grados: payloadFiles.file_certificado_grados || null,
      file_compromiso: payloadFiles.file_compromiso || null,
    };
  
    const idCreatedEstudiantePeriodo = await EstudiantePeriodoService.create(EstudiantePeriodo);
    console.log('id estudiante_período: ' + idCreatedEstudiantePeriodo);
    
    // crear registro en grados_por_matricula con id_estudiante_periodo recién creado

    const gradosPayload = payload.id_grado_educacion.map((idGrado: string) => [
      idCreatedEstudiantePeriodo,
      idGrado,
      GradoMatriculaEstado.PENDIENTE,
    ]);

    await GradosPorMatriculaService.createMany(gradosPayload);

    // crear registro en obligacion_pago con id_estudiante_periodo recién creado

    const rubro = await RubroService.findByName("Matricula");

    let obligacionPago = {
      id_obligacion_pago: generatePrimaryKey(),
      id_estudiante_periodo: idCreatedEstudiantePeriodo,
      id_rubro: rubro?.idRubro,
      monto_cuota: rubro?.montoBase || 0,
      fecha_vencimiento: null,
      estado: ObligacionPagoEstado.PENDIENTE,
    };

    const idObligacionPago = await ObligacionPagoService.create(obligacionPago);
    console.log('id obligación_pago: ' + idObligacionPago);
    
    // crear registro en pago con id_obligacion_pago recién creado

    let pago = {
      id_pago: generatePrimaryKey(),
      id_obligacion_pago: idObligacionPago,
      monto_pagado: 0,
      fecha_pago_real: new Date(),
      file_comprobante: payloadFiles.file_comprobante_pago || null,
      observaciones: '',
      estado: PagoEstado.PENDIENTE,
      fecha_verificacion: null
    };

    await PagoService.create(pago);

    await EmailService.sendMail(
  'juanpqb_19@hotmail.com',
  'Matrícula registrada exitosamente',
  `
  <div style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- HEADER -->
            <tr>
              <td align="center" style="background:#1e3a8a;padding:30px;">
                <h1 style="color:#ffffff;margin:0;font-size:28px;">
                  Educando para la Vida
                </h1>
                <p style="color:#dbeafe;margin-top:10px;font-size:14px;">
                  Plataforma de Matrículas Académicas
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:40px;">

                <h2 style="color:#111827;margin-top:0;">
                  ¡Matrícula registrada correctamente!
                </h2>

                <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                  Nos alegra informarte que tu proceso de matrícula fue realizado exitosamente en nuestra plataforma educativa.
                </p>

                <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                  Ya puedes ingresar al sistema utilizando las siguientes credenciales:
                </p>

                <!-- BOX -->
                <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin:30px 0;">
                  
                  <p style="margin:0 0 10px 0;color:#111827;font-size:15px;">
                    <strong>Correo:</strong> juanpqb_19@hotmail.com
                  </p>

                  <p style="margin:0;color:#111827;font-size:15px;">
                    <strong>Contraseña temporal:</strong> ${userResult.plainPassword}
                  </p>

                </div>

                <!-- BUTTON -->
                <div style="text-align:center;margin:35px 0;">
                  <a 
                    href="http://localhost:4173/login"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:8px;
                      font-size:16px;
                      display:inline-block;
                      font-weight:bold;
                    "
                  >
                    Ingresar a la Plataforma
                  </a>
                </div>

                <p style="color:#6b7280;font-size:14px;line-height:1.6;">
                  Por seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.
                </p>

                <p style="color:#6b7280;font-size:14px;line-height:1.6;">
                  Si no realizaste esta solicitud o tienes inconvenientes para acceder, comunícate con la institución.
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center" style="background:#f9fafb;padding:20px;border-top:1px solid #e5e7eb;">
                
                <p style="margin:0;color:#9ca3af;font-size:13px;">
                  © ${new Date().getFullYear()} Educando para la Vida
                </p>

                <p style="margin-top:8px;color:#9ca3af;font-size:12px;">
                  Este es un correo automático, por favor no responder.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `
);

    return { exists: false };
  }
}

export default new MatriculaService();
