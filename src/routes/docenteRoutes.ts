import express from 'express';
import multer from 'multer';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import { validate } from '../middleware/validate';
import CargaAcademicaController from '../controllers/CargaAcademicaController';
import DireccionGradoController from '../controllers/DireccionGradoController';
import ActividadController from '../controllers/ActividadController';
import ActividadMateriaController from '../controllers/ActividadMateriaController';
import CalificacionController from '../controllers/CalificacionController';
import AsistenciaController from '../controllers/AsistenciaController';
import ClassroomTareaController from '../controllers/ClassroomTareaController';
import ClassroomEntregaController from '../controllers/ClassroomEntregaController';
import PeriodoController from '../controllers/PeriodoController';
import PlanillaController from '../controllers/PlanillaController';
import AutoevaluacionController from '../controllers/AutoevaluacionController';
import { actividadListSchema, actividadCreateSchema, actividadUpdateSchema } from '../validators/actividad';
import { actividadMateriaListSchema, actividadMateriaCreateSchema } from '../validators/actividadMateria';
import { asistenciaListSchema, asistenciaCreateSchema, asistenciaUpsertSchema, asistenciaUpdateSchema, asistenciaUpdateFechaSchema } from '../validators/asistencia';
import { calificacionListSchema, calificacionCreateSchema, calificacionUpdateSchema } from '../validators/calificacion';
import { cargaAcademicaCreateSchema } from '../validators/cargaAcademica';
import { classroomTareaListSchema, classroomTareaCreateSchema, classroomTareaUpdateSchema } from '../validators/classroomTarea';
import { classroomEntregaListSchema, classroomEntregaCreateSchema, classroomEntregaUpdateEstadoSchema, classroomEntregaAdjuntoSchema } from '../validators/classroomEntrega';
import { periodoUpdateEstadoSchema } from '../validators/periodo';
import { planillaQuerySchema } from '../validators/planilla';
import { autoevaluacionUpsertSchema } from '../validators/autoevaluacion';
import { direccionGradoBodySchema, direccionGradoUpdateLinkSchema } from '../validators/direccionGrado';
import { idParamsSchema, adjuntoParamsSchema } from '../validators/params';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Carga Académica — admin gestiona, profesor consulta
router.get('/carga_academica', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CargaAcademicaController.list(req, res, next)));
router.get('/carga_academica/:id', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CargaAcademicaController.get(req, res, next)));
router.post('/carga_academica', requireRoles('admin', 'secretari@'), validate(cargaAcademicaCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CargaAcademicaController.create(req, res, next)));
router.delete('/carga_academica/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CargaAcademicaController.delete(req, res, next)));

// Dirección de Grado — admin asigna, profesor actualiza su link
router.get('/direccion_grado', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => DireccionGradoController.list(req, res, next)));
router.get('/direccion_grado/:id', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => DireccionGradoController.get(req, res, next)));
router.post('/direccion_grado', requireRoles('admin', 'secretari@'), validate(direccionGradoBodySchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => DireccionGradoController.create(req, res, next)));
router.put('/direccion_grado/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), validate(direccionGradoBodySchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => DireccionGradoController.update(req, res, next)));
router.patch('/direccion_grado/:id/link', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(idParamsSchema, 'params'), validate(direccionGradoUpdateLinkSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => DireccionGradoController.updateLink(req, res, next)));
router.delete('/direccion_grado/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => DireccionGradoController.delete(req, res, next)));

// Actividades — admin y profesor
router.get('/actividad', requireRoles('admin', 'profesor(a)'), validate(actividadListSchema, 'query'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadController.list(req, res, next)));
router.get('/actividad/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadController.get(req, res, next)));
router.post('/actividad', requireRoles('admin', 'profesor(a)'), validate(actividadCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadController.create(req, res, next)));
router.put('/actividad/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), validate(actividadUpdateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadController.update(req, res, next)));
router.delete('/actividad/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadController.delete(req, res, next)));

// Actividad-Materia — admin y profesor
router.get('/actividad_materia', requireRoles('admin', 'profesor(a)'), validate(actividadMateriaListSchema, 'query'), asyncHandler(ActividadMateriaController.list));
router.get('/actividad_materia/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadMateriaController.get(req, res, next)));
router.post('/actividad_materia', requireRoles('admin', 'profesor(a)'), validate(actividadMateriaCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadMateriaController.create(req, res, next)));
router.delete('/actividad_materia/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ActividadMateriaController.delete(req, res, next)));

// Calificaciones — admin y profesor
router.get('/calificacion', requireRoles('admin', 'profesor(a)', 'estudiante'), validate(calificacionListSchema, 'query'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CalificacionController.list(req, res, next)));
router.get('/calificacion/:id', requireRoles('admin', 'profesor(a)', 'estudiante'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CalificacionController.get(req, res, next)));
router.post('/calificacion', requireRoles('admin', 'profesor(a)'), validate(calificacionCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CalificacionController.create(req, res, next)));
router.put('/calificacion/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), validate(calificacionUpdateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CalificacionController.update(req, res, next)));
router.delete('/calificacion/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => CalificacionController.delete(req, res, next)));

// Asistencias — admin y profesor
router.get('/asistencia', requireRoles('admin', 'profesor(a)', 'estudiante'), validate(asistenciaListSchema, 'query'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AsistenciaController.list(req, res, next)));
router.get('/asistencia/:id', requireRoles('admin', 'profesor(a)', 'estudiante'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AsistenciaController.get(req, res, next)));
router.post('/asistencia', requireRoles('admin', 'profesor(a)'), validate(asistenciaCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AsistenciaController.create(req, res, next)));
router.post('/asistencia/upsert', requireRoles('admin', 'profesor(a)'), validate(asistenciaUpsertSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AsistenciaController.upsert(req, res, next)));
router.patch('/asistencia/fecha', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(asistenciaUpdateFechaSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AsistenciaController.updateFecha(req, res, next)));
router.put('/asistencia/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), validate(asistenciaUpdateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AsistenciaController.update(req, res, next)));
router.delete('/asistencia/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AsistenciaController.delete(req, res, next)));

// Classroom Tareas — profesor crea, todos los roles leen
router.get('/classroom_tarea', validate(classroomTareaListSchema, 'query'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.list(req, res, next)));
router.get('/classroom_tarea/:id', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.get(req, res, next)));
router.post('/classroom_tarea', requireRoles('admin', 'profesor(a)'), validate(classroomTareaCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.create(req, res, next)));
router.put('/classroom_tarea/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), validate(classroomTareaUpdateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.update(req, res, next)));
router.delete('/classroom_tarea/:id', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.delete(req, res, next)));
router.get('/classroom_tarea/:id/adjuntos', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.listAdjuntos(req, res, next)));
router.post('/classroom_tarea/:id/adjuntos', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), upload.array('files', 10), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.createAdjuntos(req, res, next)));
router.delete('/classroom_tarea/:id/adjuntos/:adjuntoId', requireRoles('admin', 'profesor(a)'), validate(adjuntoParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomTareaController.deleteAdjunto(req, res, next)));

// Classroom Entregas — estudiante entrega, profesor revisa
router.get('/classroom_entrega', validate(classroomEntregaListSchema, 'query'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.list(req, res, next)));
router.get('/classroom_entrega/:id', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.get(req, res, next)));
router.post('/classroom_entrega', requireRoles('estudiante'), validate(classroomEntregaCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.create(req, res, next)));
router.patch('/classroom_entrega/:id/estado', requireRoles('admin', 'profesor(a)'), validate(idParamsSchema, 'params'), validate(classroomEntregaUpdateEstadoSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.updateEstado(req, res, next)));
router.delete('/classroom_entrega/:id', requireRoles('admin', 'estudiante'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.delete(req, res, next)));
router.get('/classroom_entrega/:id/adjuntos', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.listAdjuntos(req, res, next)));
router.post('/classroom_entrega/:id/adjuntos', requireRoles('estudiante'), validate(idParamsSchema, 'params'), validate(classroomEntregaAdjuntoSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.createAdjunto(req, res, next)));
router.delete('/classroom_entrega/:id/adjuntos/:adjuntoId', requireRoles('admin', 'estudiante'), validate(adjuntoParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ClassroomEntregaController.deleteAdjunto(req, res, next)));

// Periodos
router.get('/periodo', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PeriodoController.list(req, res, next)));
router.get('/periodo/:id', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PeriodoController.get(req, res, next)));
router.patch('/periodo/:id/estado', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), validate(periodoUpdateEstadoSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PeriodoController.updateEstado(req, res, next)));

// Planilla Académica — admin, secretari@ y profesor
router.get('/planilla_academica', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(planillaQuerySchema, 'query'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PlanillaController.get(req, res, next)));

// Autoevaluación — director de grado registra por estudiante/periodo
router.post('/autoevaluacion/upsert', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(autoevaluacionUpsertSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AutoevaluacionController.upsert(req, res, next)));
router.delete('/autoevaluacion/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AutoevaluacionController.delete(req, res, next)));

export default router;
