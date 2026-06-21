import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import { validate } from '../middleware/validate';
import gradoController from '../controllers/GradoEducacionController';
import tipoEstudioController from '../controllers/TipoEstudioController';
import tiempoController from '../controllers/TiempoValidacionController';
import bloqueController from '../controllers/BloqueController';
import bloqueGradoController from '../controllers/BloqueGradoController';
import { idParamsSchema, bloqueParamsSchema, bloqueGradoParamsSchema } from '../validators/params';

const router = express.Router();

const adminSecretaria = [verifyToken, requireRoles('admin', 'secretari@')];

// Grado Educacion — GET público (formulario matrícula), mutaciones protegidas
router.get('/grado_educacion', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => gradoController.list(req, res, next)));
router.get('/grado_educacion/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => gradoController.get(req, res, next)));
router.post('/grado_educacion', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => gradoController.create(req, res, next)));
router.put('/grado_educacion/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => gradoController.update(req, res, next)));
router.delete('/grado_educacion/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => gradoController.delete(req, res, next)));

// Tipo Estudio — GET público, mutaciones solo admin
router.get('/tipo_estudio', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoEstudioController.list(req, res, next)));
router.get('/tipo_estudio/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoEstudioController.get(req, res, next)));
router.post('/tipo_estudio', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoEstudioController.create(req, res, next)));
router.put('/tipo_estudio/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoEstudioController.update(req, res, next)));
router.delete('/tipo_estudio/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoEstudioController.delete(req, res, next)));

// Tiempo Validacion — GET público, mutaciones solo admin
router.get('/tiempo_validacion', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tiempoController.list(req, res, next)));
router.get('/tiempo_validacion/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tiempoController.get(req, res, next)));
router.post('/tiempo_validacion', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tiempoController.create(req, res, next)));
router.put('/tiempo_validacion/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tiempoController.update(req, res, next)));
router.delete('/tiempo_validacion/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tiempoController.delete(req, res, next)));

// Bloque
router.get('/bloque', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueController.list(req, res, next)));
router.get('/bloque/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueController.get(req, res, next)));
router.post('/bloque', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueController.create(req, res, next)));
router.put('/bloque/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueController.update(req, res, next)));
router.delete('/bloque/:id', ...adminSecretaria, validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueController.delete(req, res, next)));

// Bloque Grado
router.get('/bloque_grado', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueGradoController.list(req, res, next)));
router.get('/bloque_grado/:idBloque', ...adminSecretaria, validate(bloqueParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueGradoController.listByBloque(req, res, next)));
router.post('/bloque_grado', ...adminSecretaria, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueGradoController.assign(req, res, next)));
router.delete('/bloque_grado/:idBloque/:idGradoEducacion', ...adminSecretaria, validate(bloqueGradoParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => bloqueGradoController.remove(req, res, next)));

export default router;
