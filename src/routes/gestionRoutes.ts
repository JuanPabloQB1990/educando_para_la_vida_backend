import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import RubroController from '../controllers/RubroController';
import EstudianteController from '../controllers/EstudianteController';
import EstudiantePeriodoController from '../controllers/EstudiantePeriodoController';
import AnioElectivoController from '../controllers/AnioElectivoController';
import GradosPorMatriculaController from '../controllers/GradosPorMatriculaController';
import ObligacionPagoController from '../controllers/ObligacionPagoController';
import PagoController from '../controllers/PagoController';

const router = express.Router();

// Rubro
router.get('/rubro', asyncHandler((req: express.Request, res: express.Response) => RubroController.list(req, res)));
router.get('/rubro/:id', asyncHandler((req: express.Request, res: express.Response) => RubroController.get(req, res)));
router.post('/rubro', asyncHandler((req: express.Request, res: express.Response) => RubroController.create(req, res)));
router.put('/rubro/:id', asyncHandler((req: express.Request, res: express.Response) => RubroController.update(req, res)));
router.delete('/rubro/:id', asyncHandler((req: express.Request, res: express.Response) => RubroController.delete(req, res)));

// Estudiante
router.get('/estudiante', asyncHandler((req: express.Request, res: express.Response) => EstudianteController.list(req, res)));
router.get('/estudiante/:id', asyncHandler((req: express.Request, res: express.Response) => EstudianteController.get(req, res)));
router.post('/estudiante', asyncHandler((req: express.Request, res: express.Response) => EstudianteController.create(req, res)));
router.put('/estudiante/:id', asyncHandler((req: express.Request, res: express.Response) => EstudianteController.update(req, res)));
router.delete('/estudiante/:id', asyncHandler((req: express.Request, res: express.Response) => EstudianteController.delete(req, res)));

// Estudiante Periodo
router.get('/estudiante_periodo', asyncHandler((req: express.Request, res: express.Response) => EstudiantePeriodoController.list(req, res)));
router.get('/estudiante_periodo/:id', asyncHandler((req: express.Request, res: express.Response) => EstudiantePeriodoController.get(req, res)));
router.post('/estudiante_periodo', asyncHandler((req: express.Request, res: express.Response) => EstudiantePeriodoController.create(req, res)));
router.put('/estudiante_periodo/:id', asyncHandler((req: express.Request, res: express.Response) => EstudiantePeriodoController.update(req, res)));
router.delete('/estudiante_periodo/:id', asyncHandler((req: express.Request, res: express.Response) => EstudiantePeriodoController.delete(req, res)));
router.get('/estudiante_periodo/:id/grados', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudiantePeriodoController.getGrados(req, res, next)));
router.get('/estudiante_periodo/:id/obligaciones', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudiantePeriodoController.getObligaciones(req, res, next)));
router.post('/estudiante_periodo/:id/matricular-anio', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => EstudiantePeriodoController.matricularAnio(req, res, next)));

// Anio Electivo
router.get('/anio_electivo', asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.list(req, res)));
router.get('/anio_electivo/:id', asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.get(req, res)));
router.post('/anio_electivo', asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.create(req, res)));
router.put('/anio_electivo/:id', asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.update(req, res)));
router.delete('/anio_electivo/:id', asyncHandler((req: express.Request, res: express.Response) => AnioElectivoController.delete(req, res)));

// Grados por Matricula (composite PK)
router.get('/grados_por_matricula', asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.list(req, res)));
router.get('/grados_por_matricula/:id_ep/:id_g', asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.get(req, res)));
router.post('/grados_por_matricula', asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.create(req, res)));
router.put('/grados_por_matricula/:id_ep/:id_g', asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.update(req, res)));
router.delete('/grados_por_matricula/:id_ep/:id_g', asyncHandler((req: express.Request, res: express.Response) => GradosPorMatriculaController.delete(req, res)));

// Obligacion Pago
router.get('/obligacion_pago', asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.list(req, res)));
router.get('/obligacion_pago/:id', asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.get(req, res)));
router.post('/obligacion_pago', asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.create(req, res)));
router.put('/obligacion_pago/:id', asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.update(req, res)));
router.delete('/obligacion_pago/:id', asyncHandler((req: express.Request, res: express.Response) => ObligacionPagoController.delete(req, res)));

// Pago
router.get('/pago/admin', asyncHandler((req: express.Request, res: express.Response) => PagoController.listAdmin(req, res)));
router.patch('/pago/:id/verificar', asyncHandler((req: express.Request, res: express.Response) => PagoController.verificar(req, res)));
router.get('/pago', asyncHandler((req: express.Request, res: express.Response) => PagoController.list(req, res)));
router.get('/pago/:id', asyncHandler((req: express.Request, res: express.Response) => PagoController.get(req, res)));
router.post('/pago', asyncHandler((req: express.Request, res: express.Response) => PagoController.create(req, res)));
router.put('/pago/:id', asyncHandler((req: express.Request, res: express.Response) => PagoController.update(req, res)));
router.delete('/pago/:id', asyncHandler((req: express.Request, res: express.Response) => PagoController.delete(req, res)));

export default router;
