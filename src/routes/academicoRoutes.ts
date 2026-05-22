import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import gradoController from '../controllers/GradoEducacionController';
import tipoEstudioController from '../controllers/TipoEstudioController';
import tiempoController from '../controllers/TiempoValidacionController';

const router = express.Router();

// Grado Educacion
router.get('/grado_educacion', asyncHandler((req: express.Request, res: express.Response) => gradoController.list(req, res)));
router.get('/grado_educacion/:id', asyncHandler((req: express.Request, res: express.Response) => gradoController.get(req, res)));
router.post('/grado_educacion', asyncHandler((req: express.Request, res: express.Response) => gradoController.create(req, res)));
router.put('/grado_educacion/:id', asyncHandler((req: express.Request, res: express.Response) => gradoController.update(req, res)));
router.delete('/grado_educacion/:id', asyncHandler((req: express.Request, res: express.Response) => gradoController.delete(req, res)));

// Tipo Estudio
router.get('/tipo_estudio', asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.list(req, res)));
router.get('/tipo_estudio/:id', asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.get(req, res)));
router.post('/tipo_estudio', asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.create(req, res)));
router.put('/tipo_estudio/:id', asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.update(req, res)));
router.delete('/tipo_estudio/:id', asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.delete(req, res)));

// Tiempo Validacion
router.get('/tiempo_validacion', asyncHandler((req: express.Request, res: express.Response) => tiempoController.list(req, res)));
router.get('/tiempo_validacion/:id', asyncHandler((req: express.Request, res: express.Response) => tiempoController.get(req, res)));
router.post('/tiempo_validacion', asyncHandler((req: express.Request, res: express.Response) => tiempoController.create(req, res)));
router.put('/tiempo_validacion/:id', asyncHandler((req: express.Request, res: express.Response) => tiempoController.update(req, res)));
router.delete('/tiempo_validacion/:id', asyncHandler((req: express.Request, res: express.Response) => tiempoController.delete(req, res)));

export default router;
