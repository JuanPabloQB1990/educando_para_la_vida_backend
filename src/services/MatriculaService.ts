import { GradoMatriculaEstado } from "../enums/gradosPorMatricula.enum";
import { ObligacionPagoEstado } from "../enums/obligacionPago.enum";
import { PagoEstado } from "../enums/pago.enum";
import UsuarioRepository from "../repositories/UsuarioRepository";
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
  /**
   * Actualmente valida si existe un usuario con `no_documento` y `id_rol = 2`.
   */
  async processEnrollment(form: any) {
    const no_documento = form.no_documento ?? form.noDocumento ?? null;
    // obtener id del rol 'estudiante' desde la tabla rol
    const rol = await RolService.findByName("estudiante");
    const id_rol = rol?.idRol;

    const user = await UsuarioRepository.findByDocumento(no_documento, id_rol);
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
    let usuarioPayload = payload.usuario ?? {};

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

    const estudiantePayload = payload.estudiante ?? {};

    // Crear usuario via UsuarioService y obtener id_usuario creado
    const idCreatedUser: any = await UsuarioService.create(usuarioPayload);

    const id_usuario = idCreatedUser;

    // Build payload for estudiante repository. EstudianteRepository expects `id_usuario` snake_case
    const payloadToCreateStudent = {
      id_usuario,
      ...estudiantePayload,
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
    };
    console.log(EstudiantePeriodo);
    
    const idCreatedEstudiantePeriodo = await EstudiantePeriodoService.create(EstudiantePeriodo);
    console.log('id estudiante_período: ' + idCreatedEstudiantePeriodo);
    
    // crear registro en grados_por_matricula con id_estudiante_periodo recién creado

    const gradosPayload = payload.id_grado_educacion.map((idGrado: number) => [
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
      monto_pagado: obligacionPago.monto_cuota,
      fecha_pago_real: new Date(),
      file_comprobante: payloadFiles.file_comprobante_pago || null,
      observaciones: '',
      estado: PagoEstado.PENDIENTE,
      fecha_verificacion: new Date()
    };

    await PagoService.create(pago);

    await EmailService.sendMail(
      'juanpqb_19@hotmail.com',
      "Matrícula registrada",
      `
        <h1>Educando para la Vida</h1>
        <p>Tu matrícula fue registrada correctamente.</p>
      `
    );

    return { exists: false };
  }
}

export default new MatriculaService();
