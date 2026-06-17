import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import RubroController from '../controllers/RubroController';
import EstudianteController from '../controllers/EstudianteController';
import EstudianteMatriculaController from '../controllers/EstudianteMatriculaController';
import AnioElectivoController from '../controllers/AnioElectivoController';
import GradosPorMatriculaController from '../controllers/GradosPorMatriculaController';
import ObligacionPagoController from '../controllers/ObligacionPagoController';
import PagoController from '../controllers/PagoController';
import { requireRoles } from '../middleware/roles';
const router = express.Router();

// Rubro
router.get('/rubro', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => RubroController.list(req, res)));
router.get('/rubro/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => RubroController.get(req, res)));
router.post('/rubro', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => RubroController.create(req, res)));
router.put('/rubro/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => RubroController.update(req, res)));
router.delete('/rubro/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => RubroController.delete(req, res)));

// Estudiante
router.get('/estudiante/admin', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.listAdmin(req, res, next)));
router.get('/estudiante', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => EstudianteController.list(req, res)));
router.get('/estudiante/:id/historial', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteController.getHistorial(req, res, next)));
router.get('/estudiante/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => EstudianteController.get(req, res)));
router.post('/estudiante', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => EstudianteController.create(req, res)));
router.put('/estudiante/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => EstudianteController.update(req, res)));
router.delete('/estudiante/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => EstudianteController.delete(req, res)));

// Estudiante Matricula
router.get('/estudiante_matricula', requireRoles('admin', 'secretari@'),asyncHandler((req: express.Request, res: express.Response) => EstudianteMatriculaController.list(req, res)));
router.get('/estudiante_matricula/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => EstudianteMatriculaController.get(req, res)));
router.post('/estudiante_matricula', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => EstudianteMatriculaController.create(req, res)));
router.put('/estudiante_matricula/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => EstudianteMatriculaController.update(req, res)));
router.delete('/estudiante_matricula/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => EstudianteMatriculaController.delete(req, res)));
router.get('/estudiante_matricula/:id/grados', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.getGrados(req, res, next)));
router.get('/estudiante_matricula/:id/obligaciones', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.getObligaciones(req, res, next)));
router.post('/estudiante_matricula/:id/matricular-anio', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudianteMatriculaController.matricularAnio(req, res, next)));

// Anio Electivo
router.get('/anio_electivo', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.list(req, res)));
router.get('/anio_electivo/:id', requireRoles('admin', 'secretari@', 'profesor(a)'), asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.get(req, res)));
router.post('/anio_electivo', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.create(req, res)));
router.put('/anio_electivo/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.update(req, res)));
router.delete('/anio_electivo/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.delete(req, res)));

// Grados por Matricula (composite PK)
router.get('/grados_por_matricula', requireRoles('admin', 'secretari@'),asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.list(req, res)));
router.get('/grados_por_matricula/:id_ep/:id_g', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.get(req, res)));
router.post('/grados_por_matricula', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.create(req, res)));
router.put('/grados_por_matricula/:id_ep/:id_g', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.update(req, res)));
router.delete('/grados_por_matricula/:id_ep/:id_g', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.delete(req, res)));

// Obligacion Pago
router.get('/obligacion_pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.list(req, res)));
router.get('/obligacion_pago/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.get(req, res)));
router.post('/obligacion_pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.create(req, res)));
router.put('/obligacion_pago/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.update(req, res)));
router.delete('/obligacion_pago/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.delete(req, res)));

// Pago
router.get('/pago/admin', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.listAdmin(req, res, next)));
router.patch('/pago/:id/verificar', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.verificar(req, res, next)));
router.get('/pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.list(req, res, next)));
router.get('/pago/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.get(req, res, next)));
router.post('/pago', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.create(req, res, next)));
router.put('/pago/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.update(req, res, next)));
router.delete('/pago/:id', requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PagoController.delete(req, res, next)));

export default router;
