import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import gradoController from '../controllers/GradoEducacionController';
import tipoEstudioController from '../controllers/TipoEstudioController';
import tiempoController from '../controllers/TiempoValidacionController';
import bloqueController from '../controllers/BloqueController';
import bloqueGradoController from '../controllers/BloqueGradoController';

const router = express.Router();

const adminSecretaria = [verifyToken, requireRoles('admin', 'secretari@')];

// Grado Educacion — GET público (formulario matrícula), mutaciones protegidas
router.get('/grado_educacion', asyncHandler((req: express.Request, res: express.Response) => gradoController.list(req, res)));
router.get('/grado_educacion/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => gradoController.get(req, res)));
router.post('/grado_educacion', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => gradoController.create(req, res)));
router.put('/grado_educacion/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => gradoController.update(req, res)));
router.delete('/grado_educacion/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => gradoController.delete(req, res)));

// Tipo Estudio — GET público, mutaciones solo admin
router.get('/tipo_estudio', asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.list(req, res)));
router.get('/tipo_estudio/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.get(req, res)));
router.post('/tipo_estudio', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.create(req, res)));
router.put('/tipo_estudio/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.update(req, res)));
router.delete('/tipo_estudio/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tipoEstudioController.delete(req, res)));

// Tiempo Validacion — GET público, mutaciones solo admin
router.get('/tiempo_validacion', asyncHandler((req: express.Request, res: express.Response) => tiempoController.list(req, res)));
router.get('/tiempo_validacion/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tiempoController.get(req, res)));
router.post('/tiempo_validacion', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tiempoController.create(req, res)));
router.put('/tiempo_validacion/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tiempoController.update(req, res)));
router.delete('/tiempo_validacion/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => tiempoController.delete(req, res)));

// Bloque
router.get('/bloque', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueController.list(req, res)));
router.get('/bloque/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueController.get(req, res)));
router.post('/bloque', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueController.create(req, res)));
router.put('/bloque/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueController.update(req, res)));
router.delete('/bloque/:id', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueController.delete(req, res)));

// Bloque Grado
router.get('/bloque_grado', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueGradoController.list(req, res)));
router.get('/bloque_grado/:idBloque', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueGradoController.listByBloque(req, res)));
router.post('/bloque_grado', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueGradoController.assign(req, res)));
router.delete('/bloque_grado/:idBloque/:idGradoEducacion', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response) => bloqueGradoController.remove(req, res)));

export default router;
