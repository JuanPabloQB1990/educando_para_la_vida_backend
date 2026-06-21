import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import tipoDocumentoController from '../controllers/TipoDocumentoController';
import UsuarioController from '../controllers/UsuarioController';
import RolController from '../controllers/RolController';
import { validate } from '../middleware/validate';
import { idParamsSchema, nameParamsSchema } from '../validators/params';

const router = express.Router();

// Usuario — admin only
router.get('/usuario', verifyToken, requireRoles('admin', 'secretari@'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.list(req, res, next)));
router.get('/usuario/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.get(req, res, next)));
router.post('/usuario', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.create(req, res, next)));
router.put('/usuario/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.update(req, res, next)));
router.delete('/usuario/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.delete(req, res, next)));

// TipoDocumento — GET público (formulario de matrícula), mutaciones solo admin
router.get('/tipo_documento', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoDocumentoController.list(req, res, next)));
router.get('/tipo_documento/:id', validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoDocumentoController.get(req, res, next)));
router.post('/tipo_documento', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoDocumentoController.create(req, res, next)));
router.put('/tipo_documento/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoDocumentoController.update(req, res, next)));
router.delete('/tipo_documento/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => tipoDocumentoController.delete(req, res, next)));

// Rol — admin only
router.get('/rol', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RolController.list(req, res, next)));
router.get('/rol/name/:name', verifyToken, requireRoles('admin'), validate(nameParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RolController.getByName(req, res, next)));
router.get('/rol/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RolController.get(req, res, next)));
router.post('/rol', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RolController.create(req, res, next)));
router.put('/rol/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RolController.update(req, res, next)));
router.delete('/rol/:id', verifyToken, requireRoles('admin'), validate(idParamsSchema, 'params'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => RolController.delete(req, res, next)));

export default router;
