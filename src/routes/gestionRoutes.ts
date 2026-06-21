import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireRoles } from '../middleware/roles';
import { validate } from '../middleware/validate';
import DashboardController from '../controllers/DashboardController';
import RubroController from '../controllers/RubroController';
import EstudianteController from '../controllers/EstudianteController';
import EstudianteMatriculaController from '../controllers/EstudianteMatriculaController';
import AnioElectivoController from '../controllers/AnioElectivoController';
import GradosPorMatriculaController from '../controllers/GradosPorMatriculaController';
import ObligacionPagoController from '../controllers/ObligacionPagoController';
import PagoController from '../controllers/PagoController';
import { rubroBodySchema } from '../validators/rubro';
import { pagoVerificarSchema } from '../validators/pago';
import { idParamsSchema, gradosPorMatriculaParamsSchema } from '../validators/params';

const router = express.Router();

// Dashboard
router.get('/dashboard/stats', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => DashboardController.getStats(req, res, next)));

// Rubro
router.get('/rubro', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RubroController.list(req, res, next)));
router.get('/rubro/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RubroController.get(req, res, next)));
router.post('/rubro', requireRoles('admin', 'secretari@'), validate(rubroBodySchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RubroController.create(req, res, next)));
router.put('/rubro/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), validate(rubroBodySchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RubroController.update(req, res, next)));
router.delete('/rubro/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RubroController.delete(req, res, next)));

// Estudiante
router.get('/estudiante/admin', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.listAdmin(req, res, next)));
router.get('/estudiante', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.list(req, res, next)));
router.get('/estudiante/:id/historial', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.getHistorial(req, res, next)));
router.get('/estudiante/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.get(req, res, next)));
router.post('/estudiante', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.create(req, res, next)));
router.put('/estudiante/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.update(req, res, next)));
router.delete('/estudiante/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.delete(req, res, next)));

// Estudiante Matricula
router.get('/estudiante_matricula', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.list(req, res, next)));
router.get('/estudiante_matricula/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.get(req, res, next)));
router.post('/estudiante_matricula', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.create(req, res, next)));
router.put('/estudiante_matricula/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.update(req, res, next)));
router.delete('/estudiante_matricula/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.delete(req, res, next)));
router.get('/estudiante_matricula/:id/grados', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.getGrados(req, res, next)));
router.get('/estudiante_matricula/:id/obligaciones', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.getObligaciones(req, res, next)));
router.patch('/estudiante_matricula/:id/estudio', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.patchEstudio(req, res, next)));
router.post('/estudiante_matricula/:id/matricular-anio', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.matricularAnio(req, res, next)));

// Anio Electivo
router.get('/anio_electivo', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AnioElectivoController.list(req, res, next)));
router.get('/anio_electivo/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AnioElectivoController.get(req, res, next)));
router.post('/anio_electivo', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AnioElectivoController.create(req, res, next)));
router.put('/anio_electivo/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AnioElectivoController.update(req, res, next)));
router.delete('/anio_electivo/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AnioElectivoController.delete(req, res, next)));

// Grados por Matricula (composite PK)
router.get('/grados_por_matricula', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => GradosPorMatriculaController.list(req, res, next)));
router.get('/grados_por_matricula/:id_ep/:id_g', requireRoles('admin', 'secretari@'), validate(gradosPorMatriculaParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => GradosPorMatriculaController.get(req, res, next)));
router.post('/grados_por_matricula', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => GradosPorMatriculaController.create(req, res, next)));
router.put('/grados_por_matricula/:id_ep/:id_g', requireRoles('admin', 'secretari@'), validate(gradosPorMatriculaParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => GradosPorMatriculaController.update(req, res, next)));
router.delete('/grados_por_matricula/:id_ep/:id_g', requireRoles('admin', 'secretari@'), validate(gradosPorMatriculaParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => GradosPorMatriculaController.delete(req, res, next)));

// Obligacion Pago
router.get('/obligacion_pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ObligacionPagoController.list(req, res, next)));
router.get('/obligacion_pago/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ObligacionPagoController.get(req, res, next)));
router.post('/obligacion_pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ObligacionPagoController.create(req, res, next)));
router.put('/obligacion_pago/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ObligacionPagoController.update(req, res, next)));
router.delete('/obligacion_pago/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => ObligacionPagoController.delete(req, res, next)));

// Pago
router.get('/pago/admin', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.listAdmin(req, res, next)));
router.patch('/pago/:id/verificar', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), validate(pagoVerificarSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.verificar(req, res, next)));
router.get('/pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.list(req, res, next)));
router.get('/pago/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.get(req, res, next)));
router.post('/pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.create(req, res, next)));
router.put('/pago/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.update(req, res, next)));
router.delete('/pago/:id', requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.delete(req, res, next)));

export default router;
