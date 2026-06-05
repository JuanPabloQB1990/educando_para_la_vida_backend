import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import MateriaController from '../controllers/MateriaController';
import PlanEstudioController from '../controllers/PlanEstudioController';
import PeriodoController from '../controllers/PeriodoController';

const router = express.Router();

// Materia — GET público (formulario), mutaciones admin
router.get('/materia', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => MateriaController.list(req, res)));
router.get('/materia/:id', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => MateriaController.get(req, res)));
router.post('/materia', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => MateriaController.create(req, res)));
router.put('/materia/:id', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => MateriaController.update(req, res)));
router.delete('/materia/:id', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => MateriaController.delete(req, res)));

// Plan Estudio — GET público, mutaciones admin
router.get('/plan_estudio', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => PlanEstudioController.list(req, res)));
router.get('/plan_estudio/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => PlanEstudioController.get(req, res)));
router.post('/plan_estudio', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => PlanEstudioController.create(req, res)));
router.delete('/plan_estudio/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => PlanEstudioController.delete(req, res)));

// Periodo — lectura pública, sin mutaciones directas (se crean con el año electivo)
router.get('/periodo', verifyToken, requireRoles('admin', 'secretari@'),asyncHandler((req: express.Request, res: express.Response) => PeriodoController.list(req, res)));
router.get('/periodo/:id', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response) => PeriodoController.get(req, res)));

export default router;
