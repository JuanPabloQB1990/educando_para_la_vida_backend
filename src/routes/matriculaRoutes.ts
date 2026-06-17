import express from 'express';
import multer from 'multer';
import { asyncHandler } from '../middleware/errorHandler';
import MatriculaController from '../controllers/MatriculaController';
import { formularioMatriculaSchema } from '../types';

const router = express.Router();

const upload = multer();

const expectedFileFields = [
    { name: 'file_doc', maxCount: 1 },
    { name: 'file_foto', maxCount: 1 },
    { name: 'file_certificado_grados', maxCount: 1 },
    { name: 'file_compromiso', maxCount: 1 },
    { name: 'file_comprobante_pago', maxCount: 1 },
    { name: 'file_diagnostico', maxCount: 1 },
    { name: 'padre_file', maxCount: 1 },
    { name: 'madre_file', maxCount: 1 },
    { name: 'acudiente_file', maxCount: 1 },
];

// Middleware para exigir un número mínimo de archivos en la petición
function requireMinFiles(min: number) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const reqFiles = (req as any).files;
        const files = Array.isArray(reqFiles)
            ? reqFiles
            : reqFiles && typeof reqFiles === 'object'
            ? Object.values(reqFiles).flat()
            : [];
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

function validateMatricula(req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		// multer coloca los campos de FormData en req.body (todos como strings)
		const body = req.body || {};

		// Normalizar campos que pueden venir como JSON strings o campos repetidos
		if (typeof body.id_grado_educacion === 'string') {
			try {
				body.id_grado_educacion = JSON.parse(body.id_grado_educacion);
			} catch (e) {
				// si no es JSON, puede ser un solo valor
				body.id_grado_educacion = [body.id_grado_educacion];
			}
		}
		if (Array.isArray(body.id_grado_educacion)) {
			body.id_grado_educacion = body.id_grado_educacion.map(String);
		}

        const reqFiles = (req as any).files;
        const files = Array.isArray(reqFiles)
            ? reqFiles
            : reqFiles && typeof reqFiles === 'object'
            ? Object.values(reqFiles).flat()
            : [];
        const receivedFileNames = files.map((file: any) => file.fieldname);
		for (const file of files as any[]) {
			if (file && file.fieldname) {
				body[file.fieldname] = file.originalname || file.filename || 'uploaded_file';
			}
		}

		if (typeof body.limitaciones === 'string') {
			body.limitaciones = [body.limitaciones];
		}
		if (typeof body.capacidades === 'string') {
			body.capacidades = [body.capacidades];
		}

		formularioMatriculaSchema.parse({
            nombres: body.nombres,
			apellido1: body.apellido1,
			apellido2: body.apellido2,
			contacto1: body.contacto1,
			contacto2: body.contacto2,
			email: body.email,
			id_tipo_documento: body.id_tipo_documento,
			no_documento: body.no_documento,
			fecha_expedicion_documento: body.fecha_expedicion_documento,
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
            file_doc: body.file_doc,
            file_foto: body.file_foto,
            id_tipo_estudio: body.id_tipo_estudio,
            id_grado_educacion: body.id_grado_educacion,
            id_tiempo_validacion: body.id_tiempo_validacion,
            file_certificado_grados: body.file_certificado_grados,
            limitaciones: body.limitaciones,
            otras_limitaciones: body.otras_limitaciones,
            file_diagnostico: body.file_diagnostico,
            capacidades: body.capacidades,
            ci_puntaje: body.ci_puntaje,
            problemasalud: body.problemasalud,
            eps: body.eps,
            ips: body.ips,
            rh: body.rh,
            observaciones: body.observaciones,
            file_compromiso: body.file_compromiso,
            file_comprobante_pago: body.file_comprobante_pago,
            padre_apellido1: body.padre_apellido1,
            padre_apellido2: body.padre_apellido2,
            padre_nombre: body.padre_nombre,
            padre_cedula: body.padre_cedula,
            padre_file: body.padre_file,
            padre_contacto1: body.padre_contacto1,
            padre_contacto2: body.padre_contacto2,
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

		// pasar el body normalizado adelante
		req.body = body;
		return next();
	} catch (err) {
        console.error(err);
		const zErr = err as any;
		const issues = Array.isArray(zErr?.issues) ? zErr.issues : [];
		const message = issues.length ? issues.map((e: any) => e.message).join('; ') : 'Datos inválidos';
        return res.status(400).json({
			success: false,
			message: 'Validación de datos fallida',
			data: null,
			error: { message },
		});
	}
}

router.post('/', upload.fields(expectedFileFields), requireMinFiles(8), validateMatricula, asyncHandler((req: express.Request, res: express.Response) => MatriculaController.create(req, res)));

export default router;
