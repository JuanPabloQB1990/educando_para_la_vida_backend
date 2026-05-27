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

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Carga Académica — admin gestiona, profesor consulta
router.get('/carga_academica', asyncHandler((req, res) => CargaAcademicaController.list(req, res)));
router.get('/carga_academica/:id', asyncHandler((req, res) => CargaAcademicaController.get(req, res)));
router.post('/carga_academica', requireRoles('admin'), asyncHandler((req, res) => CargaAcademicaController.create(req, res)));
router.delete('/carga_academica/:id', requireRoles('admin'), asyncHandler((req, res) => CargaAcademicaController.delete(req, res)));

// Dirección de Grado — admin asigna, profesor actualiza su link
router.get('/direccion_grado', asyncHandler((req, res) => DireccionGradoController.list(req, res)));
router.get('/direccion_grado/:id', asyncHandler((req, res) => DireccionGradoController.get(req, res)));
router.post('/direccion_grado', requireRoles('admin'), asyncHandler((req, res) => DireccionGradoController.create(req, res)));
router.put('/direccion_grado/:id', requireRoles('admin'), asyncHandler((req, res) => DireccionGradoController.update(req, res)));
router.patch('/direccion_grado/:id/link', requireRoles('admin', 'profesor'), asyncHandler((req, res) => DireccionGradoController.updateLink(req, res)));
router.delete('/direccion_grado/:id', requireRoles('admin'), asyncHandler((req, res) => DireccionGradoController.delete(req, res)));

// Actividades — admin y profesor
router.get('/actividad', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadController.list(req, res)));
router.get('/actividad/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadController.get(req, res)));
router.post('/actividad', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadController.create(req, res)));
router.put('/actividad/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadController.update(req, res)));
router.delete('/actividad/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadController.delete(req, res)));

// Actividad-Materia — admin y profesor
router.get('/actividad_materia', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadMateriaController.list(req, res)));
router.get('/actividad_materia/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadMateriaController.get(req, res)));
router.post('/actividad_materia', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadMateriaController.create(req, res)));
router.put('/actividad_materia/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadMateriaController.update(req, res)));
router.delete('/actividad_materia/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ActividadMateriaController.delete(req, res)));

// Calificaciones — admin y profesor
router.get('/calificacion', requireRoles('admin', 'profesor', 'estudiante'), asyncHandler((req, res) => CalificacionController.list(req, res)));
router.get('/calificacion/:id', requireRoles('admin', 'profesor', 'estudiante'), asyncHandler((req, res) => CalificacionController.get(req, res)));
router.post('/calificacion', requireRoles('admin', 'profesor'), asyncHandler((req, res) => CalificacionController.create(req, res)));
router.put('/calificacion/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => CalificacionController.update(req, res)));
router.delete('/calificacion/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => CalificacionController.delete(req, res)));

// Asistencias — admin y profesor
router.get('/asistencia', requireRoles('admin', 'profesor', 'estudiante'), asyncHandler((req, res) => AsistenciaController.list(req, res)));
router.get('/asistencia/:id', requireRoles('admin', 'profesor', 'estudiante'), asyncHandler((req, res) => AsistenciaController.get(req, res)));
router.post('/asistencia', requireRoles('admin', 'profesor'), asyncHandler((req, res) => AsistenciaController.create(req, res)));
router.put('/asistencia/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => AsistenciaController.update(req, res)));
router.delete('/asistencia/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => AsistenciaController.delete(req, res)));

// Classroom Tareas — profesor crea, todos los roles leen
router.get('/classroom_tarea', asyncHandler((req, res) => ClassroomTareaController.list(req, res)));
router.get('/classroom_tarea/:id', asyncHandler((req, res) => ClassroomTareaController.get(req, res)));
router.post('/classroom_tarea', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ClassroomTareaController.create(req, res)));
router.put('/classroom_tarea/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ClassroomTareaController.update(req, res)));
router.delete('/classroom_tarea/:id', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ClassroomTareaController.delete(req, res)));
router.get('/classroom_tarea/:id/adjuntos', asyncHandler((req, res) => ClassroomTareaController.listAdjuntos(req, res)));
router.post('/classroom_tarea/:id/adjuntos', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ClassroomTareaController.createAdjunto(req, res)));
router.delete('/classroom_tarea/:id/adjuntos/:adjuntoId', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ClassroomTareaController.deleteAdjunto(req, res)));

// Classroom Entregas — estudiante entrega, profesor revisa
router.get('/classroom_entrega', asyncHandler((req, res) => ClassroomEntregaController.list(req, res)));
router.get('/classroom_entrega/:id', asyncHandler((req, res) => ClassroomEntregaController.get(req, res)));
router.post('/classroom_entrega', requireRoles('estudiante'), asyncHandler((req, res) => ClassroomEntregaController.create(req, res)));
router.patch('/classroom_entrega/:id/estado', requireRoles('admin', 'profesor'), asyncHandler((req, res) => ClassroomEntregaController.updateEstado(req, res)));
router.delete('/classroom_entrega/:id', requireRoles('admin', 'estudiante'), asyncHandler((req, res) => ClassroomEntregaController.delete(req, res)));
router.get('/classroom_entrega/:id/adjuntos', asyncHandler((req, res) => ClassroomEntregaController.listAdjuntos(req, res)));
router.post('/classroom_entrega/:id/adjuntos', requireRoles('estudiante'), asyncHandler((req, res) => ClassroomEntregaController.createAdjunto(req, res)));
router.delete('/classroom_entrega/:id/adjuntos/:adjuntoId', requireRoles('admin', 'estudiante'), asyncHandler((req, res) => ClassroomEntregaController.deleteAdjunto(req, res)));

export default router;
