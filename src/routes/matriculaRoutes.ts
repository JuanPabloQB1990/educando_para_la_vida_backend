import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler';
import MatriculaController from '../controllers/MatriculaController';

const router = express.Router();
const upload = multer();

// Middleware para exigir un número mínimo de archivos en la petición
function requireMinFiles(min: number) {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const files = req.files as Express.Multer.File[] | undefined;
		if (!files || files.length < min) {
			return res.status(400).json({
				success: false,
				message: `Se requieren al menos ${min} archivos en la petición`,
				data: null,
				error: { message: `Se requieren al menos ${min} archivos en la petición` },
			});
		}
		next();
	};
}

// Recibe FormData desde el frontend y archivos (mínimo 8 archivos)
// Validación Zod de los campos requeridos (campos que no pueden ser null en las tablas)
const usuarioSchema = z.object({
	nombres: z.string().min(1, 'nombres es requerido'),
	apellido1: z.string().min(1, 'apellido1 es requerido'),
	apellido2: z.string().min(1, 'segundo apellido es requerido'),
	contacto1: z.string().min(1, 'contacto 1 es requerido'),
	contacto2: z.string().optional().nullable(),
	email: z.string().min(1, 'email es requerido'),
	id_tipo_documento: z.string().min(1, 'id_tipo_documento es requerido'),
	no_documento: z.string().min(1, 'no_documento es requerido'),
    fecha_expedicion_documento: z.string().min(1, 'la fecha de expedicion del documento es requerida'),
});

const estudianteSchema = z.object({
	// id_usuario se generará en el backend; recibimos datos del estudiante desde el formulario
	fecha_nacimiento: z.string().min(1, 'fecha de nacimiento es requerida'),
	edad: z.string().min(1, 'edad es requerida'),
	sexo: z.string().min(1, 'sexo es requerido'),
    municipio_nacimiento: z.string().min(1, 'municipio de nacimiento es requerido'),
    departamento_nacimiento: z.string().min(1, 'departamento de nacimiento es requerido'),
    pais_nacimiento: z.string().min(1, 'país de nacimiento es requerido'),
    religion: z.string().min(1, 'religión es requerida'),
    barrio_vereda_actual: z.string().min(1, 'barrio o vereda actual es requerido'),
    ciudad_actual: z.string().min(1, 'ciudad actual es requerida'),
    departamento_actual: z.string().min(1, 'departamento actual es requerido'),
    pais_actual: z.string().min(1, 'país actual es requerido'),
    contacto1: z.string().min(1, 'contacto 1 es requerido'),
    contacto2: z.string().optional().nullable(),
    file_doc: z.string().min(1, 'documento de identidad es requerido'),
    file_foto: z.string().min(1, 'foto es requerida'),
    limitaciones: z.array(z.string()).optional(),
    file_diagnostico: z.string().min(1, 'diagnóstico es requerido'),
    capacidades: z.array(z.string()).optional(),
    ci_puntaje: z.string().min(1, 'puntaje del CI es requerido'),
    problemasalud: z.string().optional().nullable(),
    ps: z.string().optional().nullable(),
    ips: z.string().optional().nullable(),
    rh_estudiante: z.string().optional().nullable(),
    observaciones: z.string().optional().nullable(),
    file_compromiso: z.string().min(1, 'compromiso es requerido'),
    file_comprobante_pago: z.string().min(1, 'comprobante de pago es requerido'),
    padre_apellido1: z.string().min(1, 'primer apellido del padre es requerido'),
    padre_apellido2: z.string().min(1, 'segundo apellido del padre es requerido'),
    padre_nombre: z.string().min(1, 'nombre del padre es requerido'),
    padre_cedula: z.string().min(1, 'cédula del padre es requerida'),
    padre_file: z.string().min(1, 'archivo del padre es requerido'),
    padre_contacto1: z.string().min(1, 'contacto 1 del padre es requerido'),
    padre_contacto2: z.string().optional().nullable(),
    madre_apellido1: z.string().min(1, 'primer apellido de la madre es requerido'),
    madre_apellido2: z.string().min(1, 'segundo apellido de la madre es requerido'),
    madre_nombre: z.string().min(1, 'nombre de la madre es requerido'),
    madre_cedula: z.string().min(1, 'cédula de la madre es requerida'),
    madre_file: z.string().min(1, 'archivo de la madre es requerido'),
    madre_contacto1: z.string().min(1, 'contacto 1 de la madre es requerido'),
    madre_contacto2: z.string().optional().nullable(),
    acudiente_apellido1: z.string().min(1, 'primer apellido del acudiente es requerido'),
    acudiente_apellido2: z.string().min(1, 'segundo apellido del acudiente es requerido'),
    acudiente_nombre: z.string().min(1, 'nombre del acudiente es requerido'),
    acudiente_cedula: z.string().min(1, 'cédula del acudiente es requerida'),
    acudiente_file: z.string().min(1, 'archivo del acudiente es requerido'),
    acudiente_contacto1: z.string().min(1, 'contacto 1 del acudiente es requerido'),
    acudiente_contacto2: z.string().optional().nullable(),
    ref1_nombres: z.string().min(1, 'nombres de la referencia 1 es requerido'),
    ref1_apellidos: z.string().min(1, 'apellidos de la referencia 1 es requerido'),
    ref1_tel: z.string().min(1, 'teléfono de la referencia 1 es requerido'),
    ref2_nombres: z.string().min(1, 'nombres de la referencia 2 es requerido'),
    ref2_apellidos: z.string().min(1, 'apellidos de la referencia 2 es requerido'),
    ref2_tel: z.string().min(1, 'teléfono de la referencia 2 es requerido'),
    ref3_nombres: z.string().min(1, 'nombres de la referencia 3 es requerido'),
    ref3_apellidos: z.string().min(1, 'apellidos de la referencia 3 es requerido'),
    ref3_tel: z.string().min(1, 'teléfono de la referencia 3 es requerido'),
    ref4_nombres: z.string().min(1, 'nombres de la referencia 4 es requerido'),
    ref4_apellidos: z.string().min(1, 'apellidos de la referencia 4 es requerido'),
    ref4_tel: z.string().min(1, 'teléfono de la referencia 4 es requerido'),
    ref5_nombres: z.string().min(1, 'nombres de la referencia 5 es requerido'),
    ref5_apellidos: z.string().min(1, 'apellidos de la referencia 5 es requerido'),
    ref5_tel: z.string().min(1, 'teléfono de la referencia 5 es requerido'),
    ref6_nombres: z.string().min(1, 'nombres de la referencia 6 es requerido'),
    ref6_apellidos: z.string().min(1, 'apellidos de la referencia 6 es requerido'),
    ref6_tel: z.string().min(1, 'teléfono de la referencia 6 es requerido'),
});

const estudiantePeriodoSchema = z.object({
	id_tipo_estudio: z.string().min(1, 'id de tipo estudio es requerido'),
	id_tiempo_validacion: z.string().optional().nullable(),
    file_certificado_grados: z.string().min(1, 'certificado de grados es requerido'),
	// id_anio_electivo será asignado por admin, puede no llegar en el formulario
});

// id_grado_educacion se enviará como JSON (array). Validamos que sea array de strings no vacíos cuando aplica.
const gradosPorMatriculaSchema = z.object({
	id_grado_educacion: z.array(z.string().min(1)).nonempty('Se requiere al menos un id_grado_educacion'),
});

function validateMatricula(req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		// multer coloca los campos de FormData en req.body (todos como strings)
		const body = req.body || {};

		// Normalizar campos que pueden venir como JSON strings
		// id_grado_educacion puede venir como JSON string — intentamos parsearlo
		if (typeof body.id_grado_educacion === 'string') {
			try {
				body.id_grado_educacion = JSON.parse(body.id_grado_educacion);
			} catch (e) {
				// si no es JSON, puede ser un solo valor
				body.id_grado_educacion = [body.id_grado_educacion];
			}
		}

		// Validar secciones
		usuarioSchema.parse({
			nombres: body.nombres,
			apellido1: body.apellido1,
			apellido2: body.apellido2,
			contacto1: body.contacto1,
			contacto2: body.contacto2,
			email: body.email,
			id_tipo_documento: body.id_tipo_documento,
			no_documento: body.no_documento,
			fecha_expedicion_documento: body.fecha_expedicion_documento,
		});

		estudianteSchema.parse({
			fecha_nacimiento: body.fecha_nacimiento,
			edad: body.edad,
			sexo: body.sexo,
            municipio_nacimiento: body.municipio_nacimiento,
            departamento_nacimiento: body.departamento_nacimiento,
            pais_nacimiento: body.pais_nacimiento,
            religion: body.religion,
            barrio_vereda_actual: body.barrio_vereda_actual,
            ciudad_actual: body.ciudad_actual,
            departamento_actual: body.departamento_actual,
            pais_actual: body.pais_actual,
            contacto1: body.contacto1,
            contacto2: body.contacto2,
            file_doc: body.file_doc,
            file_foto: body.file_foto,
            file_certificado_grados: body.file_certificado_grados,
            limitaciones: body.limitaciones,
            file_diagnostico: body.file_diagnostico,
            capacidades: body.capacidades,
            ci_puntaje: body.ci_puntaje,
            problemasalud: body.problemasalud,
            ps: body.ps,
            ips: body.ips,
            rh_estudiante: body.rh_estudiante,
            observaciones: body.observaciones,
            file_compromiso: body.file_compromiso,
            file_comprobante_pago: body.file_comprobante_pago,
            padre_apellido1: body.padr_apellido1,
            padre_apellido2: body.padr_apellido2,
            padre_nombre: body.padr_nombre,
            padre_cedula: body.padr_cedula,
            padre_file: body.padr_file,
            padre_contacto1: body.padr_contacto1,
            padre_contacto2: body.padr_contacto2,
            madre_apellido1: body.madre_apellido1,
            madre_apellido2: body.madre_apellido2,
            madre_nombre: body.madre_nombre,
            madre_cedula: body.madre_cedula,
            madre_file: body.madre_file,
            madre_contacto1: body.madre_contacto1,
            madre_contacto2: body.madre_contacto2,
            acudiente_apellido1: body.acudiente_apellido1,
            acudiente_apellido2: body.acudiente_apellido2,
            acudiente_nombre: body.acudiente_nombre,
            acudiente_cedula: body.acudiente_cedula,
            acudiente_file: body.acudiente_file,
            acudiente_contacto1: body.acudiente_contacto1,
            acudiente_contacto2: body.acudiente_contacto2,
            ref1_nombres: body.ref1_nombres,
            ref1_apellidos: body.ref1_apellidos,
            ref1_tel: body.ref1_tel,
            ref2_nombres: body.ref2_nombres,
            ref2_apellidos: body.ref2_apellidos,
            ref2_tel: body.ref2_tel,
            ref3_nombres: body.ref3_nombres,
            ref3_apellidos: body.ref3_apellidos,
            ref3_tel: body.ref3_tel,
            ref4_nombres: body.ref4_nombres,
            ref4_apellidos: body.ref4_apellidos,
            ref4_tel: body.ref4_tel,
            ref5_nombres: body.ref5_nombres,
            ref5_apellidos: body.ref5_apellidos,
            ref5_tel: body.ref5_tel,
            ref6_nombres: body.ref6_nombres,
            ref6_apellidos: body.ref6_apellidos,
            ref6_tel: body.ref6_tel,

		});

		estudiantePeriodoSchema.parse({
			id_tipo_estudio: body.id_tipo_estudio,
			id_tiempo_validacion: body.id_tiempo_validacion,
		});

		// Sólo validar grados array si viene en el formulario (por ejemplo para validación de grados o educación formal)
		if (body.id_grado_educacion) {
			gradosPorMatriculaSchema.parse({ id_grado_educacion: body.id_grado_educacion });
		}

		// pasar el body normalizado adelante
		req.body = body;
		return next();
	} catch (err) {
		const zErr = err as any;
		const message = zErr?.errors ? zErr.errors.map((e: any) => e.message).join('; ') : 'Datos inválidos';
		return res.status(400).json({
			success: false,
			message: 'Validación de datos fallida',
			data: null,
			error: { message },
		});
	}
}

router.post('/', upload.any(), requireMinFiles(8), validateMatricula, asyncHandler((req: express.Request, res: express.Response) => MatriculaController.create(req, res)));

export default router;
