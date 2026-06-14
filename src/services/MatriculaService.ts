import { GradoMatriculaEstado } from "../enums/gradosPorMatricula.enum";
import { ObligacionPagoEstado } from "../enums/obligacionPago.enum";
import { PagoEstado } from "../enums/pago.enum";
import UsuarioRepository from "../repositories/UsuarioRepository";
import { matriculaExitosa } from "../templates/templatesSendEmail";
import { FormularioMatriculaSchema } from "../types";
import { generatePrimaryKey } from "../utils/generatePrimaryKey";
import { EmailService } from "../utils/sendEmail";
import { uploadHelper } from "../utils/uploadFIleToGoogleDrive";
import EstudianteMatriculaService from "./EstudianteMatriculaService";
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
    const id_rol = rol?.id;

    const user = await UsuarioRepository.findByDocumento(no_documento, id_rol);
  
    if (user) return { exists: true };

    // No existe: proceder a crear usuario y estudiante.
    // Aseguramos que el payload tenga el rol de estudiante
    const payload = { ...form, id_rol };

    // =========================
    // SUBIR ARCHIVOS A GOOGLE DRIVE
    // =========================

  

  const payloadFiles = {
    file_doc: await uploadHelper(payload.file_doc, "documento", payload.nombres, payload.no_documento),

    file_foto: await uploadHelper(payload.file_foto, "foto", payload.nombres, payload.no_documento),

    file_compromiso: await uploadHelper(payload.file_compromiso, "compromiso", payload.nombres, payload.no_documento),

    padre_file: await uploadHelper(payload.padre_file, "padre", payload.nombres, payload.no_documento),

    madre_file: await uploadHelper(payload.madre_file, "madre", payload.nombres, payload.no_documento),

    acudiente_file: await uploadHelper(payload.acudiente_file, "acudiente", payload.nombres, payload.no_documento),

    // nullable
    file_diagnostico: payload.file_diagnostico
      ? await uploadHelper(payload.file_diagnostico, "diagnostico", payload.nombres, payload.no_documento)
      : null,

    file_certificado_grados: await uploadHelper(
      payload.file_certificado_grados,
      "certificado_grados", payload.nombres, payload.no_documento
    ),

    file_comprobante_pago: await uploadHelper(
      payload.file_comprobante_pago,
      "comprobante_pago", payload.nombres, payload.no_documento
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
    
    // crear registro en estudiante_matricula con id_estudiante recién creado

    let estudianteMatricula = {
      id_estudiante_matricula: generatePrimaryKey(),
      id_estudiante: idEstudiante,
      id_tipo_estudio: payload.id_tipo_estudio || null,
      id_tiempo_validacion: payload.id_tiempo_validacion || null,
      fecha_inscripcion: new Date(),
      file_certificado_grados: payloadFiles.file_certificado_grados || null,
      file_compromiso: payloadFiles.file_compromiso || null,
    };

    const idCreatedEstudianteMatricula = await EstudianteMatriculaService.create(estudianteMatricula);
    console.log('id estudiante_matricula: ' + idCreatedEstudianteMatricula);
    
    // crear registro en grados_por_matricula con id_estudiante_matricula recién creado

    const gradosPayload = payload.id_grado_educacion.map((idGrado: string) => [
      idCreatedEstudianteMatricula,
      idGrado,
      GradoMatriculaEstado.PENDIENTE,
    ]);

    await GradosPorMatriculaService.createMany(gradosPayload);

    // crear registro en obligacion_pago con id_estudiante_matricula recién creado

    const rubro = await RubroService.findByName("Matricula");

    let obligacionPago = {
      id_obligacion_pago: generatePrimaryKey(),
      id_estudiante_matricula: idCreatedEstudianteMatricula,
      id_rubro: rubro?.id,
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
      'juanpabloqb1990@gmail.com',
      'Matrícula registrada exitosamente',
      matriculaExitosa(userResult.plainPassword)
    );

    return { exists: false };
  }
}

export default new MatriculaService();
