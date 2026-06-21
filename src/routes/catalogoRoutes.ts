import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import { validate } from '../middleware/validate';
import MateriaController from '../controllers/MateriaController';
import PlanEstudioController from '../controllers/PlanEstudioController';
import PeriodoController from '../controllers/PeriodoController';
import { materiaBodySchema } from '../validators/materia';
import { planEstudioCreateSchema } from '../validators/planEstudio';
import { idParamsSchema } from '../validators/params';

const router = express.Router();

// Materia — GET público (formulario), mutaciones admin
router.get('/materia', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => MateriaController.list(req, res, next)));
router.get('/materia/:id', verifyToken, requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => MateriaController.get(req, res, next)));
router.post('/materia', verifyToken, requireRoles('admin', 'secretari@'), validate(materiaBodySchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => MateriaController.create(req, res, next)));
router.put('/materia/:id', verifyToken, requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), validate(materiaBodySchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => MateriaController.update(req, res, next)));
router.delete('/materia/:id', verifyToken, requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => MateriaController.delete(req, res, next)));

// Plan Estudio — GET público, mutaciones admin
router.get('/plan_estudio', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PlanEstudioController.list(req, res, next)));
router.get('/plan_estudio/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PlanEstudioController.get(req, res, next)));
router.post('/plan_estudio', verifyToken, requireRoles('admin'), validate(planEstudioCreateSchema), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PlanEstudioController.create(req, res, next)));
router.delete('/plan_estudio/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PlanEstudioController.delete(req, res, next)));

// Periodo — lectura pública, sin mutaciones directas (se crean con el año electivo)
router.get('/periodo', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PeriodoController.list(req, res, next)));
router.get('/periodo/:id', verifyToken, requireRoles('admin', 'secretari@'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => PeriodoController.get(req, res, next)));

export default router;
