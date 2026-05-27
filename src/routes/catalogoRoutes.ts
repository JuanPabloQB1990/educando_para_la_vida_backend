import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import MateriaController from '../controllers/MateriaController';
import PlanEstudioController from '../controllers/PlanEstudioController';
import PeriodoController from '../controllers/PeriodoController';

const router = express.Router();

// Materia — GET público (formulario), mutaciones admin
router.get('/materia', asyncHandler((req, res) => MateriaController.list(req, res)));
router.get('/materia/:id', asyncHandler((req, res) => MateriaController.get(req, res)));
router.post('/materia', verifyToken, requireRoles('admin'), asyncHandler((req, res) => MateriaController.create(req, res)));
router.put('/materia/:id', verifyToken, requireRoles('admin'), asyncHandler((req, res) => MateriaController.update(req, res)));
router.delete('/materia/:id', verifyToken, requireRoles('admin'), asyncHandler((req, res) => MateriaController.delete(req, res)));

// Plan Estudio — GET público, mutaciones admin
router.get('/plan_estudio', asyncHandler((req, res) => PlanEstudioController.list(req, res)));
router.get('/plan_estudio/:id', asyncHandler((req, res) => PlanEstudioController.get(req, res)));
router.post('/plan_estudio', verifyToken, requireRoles('admin'), asyncHandler((req, res) => PlanEstudioController.create(req, res)));
router.delete('/plan_estudio/:id', verifyToken, requireRoles('admin'), asyncHandler((req, res) => PlanEstudioController.delete(req, res)));

// Periodo — lectura pública, sin mutaciones directas (se crean con el año electivo)
router.get('/periodo', asyncHandler((req, res) => PeriodoController.list(req, res)));
router.get('/periodo/:id', asyncHandler((req, res) => PeriodoController.get(req, res)));

export default router;
