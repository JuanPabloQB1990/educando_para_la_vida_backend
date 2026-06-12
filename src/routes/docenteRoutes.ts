import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
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

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Carga Académica — admin gestiona, profesor consulta
router.get('/carga_academica', asyncHandler((req: express.Request, res: express.Response) => CargaAcademicaController.list(req, res)));
router.get('/carga_academica/:id', asyncHandler((req: express.Request, res: express.Response) => CargaAcademicaController.get(req, res)));
router.post('/carga_academica', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => CargaAcademicaController.create(req, res)));
router.delete('/carga_academica/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => CargaAcademicaController.delete(req, res)));

// Dirección de Grado — admin asigna, profesor actualiza su link
router.get('/direccion_grado', asyncHandler((req: express.Request, res: express.Response) => DireccionGradoController.list(req, res)));
router.get('/direccion_grado/:id', asyncHandler((req: express.Request, res: express.Response) => DireccionGradoController.get(req, res)));
router.post('/direccion_grado', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => DireccionGradoController.create(req, res)));
router.put('/direccion_grado/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => DireccionGradoController.update(req, res)));
router.patch('/direccion_grado/:id/link', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => DireccionGradoController.updateLink(req, res)));
router.delete('/direccion_grado/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => DireccionGradoController.delete(req, res)));

// Actividades — admin y profesor
router.get('/actividad', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadController.list(req, res)));
router.get('/actividad/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadController.get(req, res)));
router.post('/actividad', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadController.create(req, res)));
router.put('/actividad/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadController.update(req, res)));
router.delete('/actividad/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadController.delete(req, res)));

// Actividad-Materia — admin y profesor
router.get('/actividad_materia', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadMateriaController.list(req, res)));
router.get('/actividad_materia/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadMateriaController.get(req, res)));
router.post('/actividad_materia', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadMateriaController.create(req, res)));
router.delete('/actividad_materia/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ActividadMateriaController.delete(req, res)));

// Calificaciones — admin y profesor
router.get('/calificacion', requireRoles('admin', 'profesor(a)', 'estudiante'), asyncHandler((req: express.Request, res: express.Response) => CalificacionController.list(req, res)));
router.get('/calificacion/:id', requireRoles('admin', 'profesor(a)', 'estudiante'), asyncHandler((req: express.Request, res: express.Response) => CalificacionController.get(req, res)));
router.post('/calificacion', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => CalificacionController.create(req, res)));
router.put('/calificacion/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => CalificacionController.update(req, res)));
router.delete('/calificacion/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => CalificacionController.delete(req, res)));

// Asistencias — admin y profesor
router.get('/asistencia', requireRoles('admin', 'profesor(a)', 'estudiante'), asyncHandler((req: express.Request, res: express.Response) => AsistenciaController.list(req, res)));
router.get('/asistencia/:id', requireRoles('admin', 'profesor(a)', 'estudiante'), asyncHandler((req: express.Request, res: express.Response) => AsistenciaController.get(req, res)));
router.post('/asistencia', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => AsistenciaController.create(req, res)));
router.post('/asistencia/upsert', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => AsistenciaController.upsert(req, res)));
router.put('/asistencia/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => AsistenciaController.update(req, res)));
router.delete('/asistencia/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => AsistenciaController.delete(req, res)));

// Classroom Tareas — profesor crea, todos los roles leen
router.get('/classroom_tarea', asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.list(req, res)));
router.get('/classroom_tarea/:id', asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.get(req, res)));
router.post('/classroom_tarea', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.create(req, res)));
router.put('/classroom_tarea/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.update(req, res)));
router.delete('/classroom_tarea/:id', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.delete(req, res)));
router.get('/classroom_tarea/:id/adjuntos', asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.listAdjuntos(req, res)));
router.post('/classroom_tarea/:id/adjuntos', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.createAdjunto(req, res)));
router.delete('/classroom_tarea/:id/adjuntos/:adjuntoId', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ClassroomTareaController.deleteAdjunto(req, res)));

// Classroom Entregas — estudiante entrega, profesor revisa
router.get('/classroom_entrega', asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.list(req, res)));
router.get('/classroom_entrega/:id', asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.get(req, res)));
router.post('/classroom_entrega', requireRoles('estudiante'), asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.create(req, res)));
router.patch('/classroom_entrega/:id/estado', requireRoles('admin', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.updateEstado(req, res)));
router.delete('/classroom_entrega/:id', requireRoles('admin', 'estudiante'), asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.delete(req, res)));
router.get('/classroom_entrega/:id/adjuntos', asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.listAdjuntos(req, res)));
router.post('/classroom_entrega/:id/adjuntos', requireRoles('estudiante'), asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.createAdjunto(req, res)));
router.delete('/classroom_entrega/:id/adjuntos/:adjuntoId', requireRoles('admin', 'estudiante'), asyncHandler((req: express.Request, res: express.Response) => ClassroomEntregaController.deleteAdjunto(req, res)));

// Periodos
router.get('/periodo', asyncHandler((req: express.Request, res: express.Response) => PeriodoController.list(req, res)));
router.get('/periodo/:id', asyncHandler((req: express.Request, res: express.Response) => PeriodoController.get(req, res)));
router.patch('/periodo/:id/estado', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PeriodoController.updateEstado(req, res, next)));

// Planilla Académica — admin, secretari@ y profesor
router.get('/planilla_academica', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => PlanillaController.get(req, res)));

export default router;
