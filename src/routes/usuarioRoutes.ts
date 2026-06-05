import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import tipoDocumentoController from '../controllers/TipoDocumentoController';
import UsuarioController from '../controllers/UsuarioController';
import RolController from '../controllers/RolController';

const router = express.Router();
// recordar pegar esto en create usuario 0> verifyToken, requireRoles('admin'),
// Usuario — admin only
router.get('/usuario', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.list(req, res, next)));
router.get('/usuario/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.get(req, res, next)));
router.post('/usuario',  asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.create(req, res, next)));
router.put('/usuario/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.update(req, res, next)));
router.delete('/usuario/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => UsuarioController.delete(req, res, next)));

// TipoDocumento — GET público (formulario de matrícula), mutaciones solo admin
router.get('/tipo_documento', asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.list(req, res)));
router.get('/tipo_documento/:id', asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.get(req, res)));
router.post('/tipo_documento', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.create(req, res)));
router.put('/tipo_documento/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.update(req, res)));
router.delete('/tipo_documento/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.delete(req, res)));

// Rol — admin only
router.get('/rol', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => RolController.list(req, res)));
router.get('/rol/name/:name', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => RolController.getByName(req, res)));
router.get('/rol/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => RolController.get(req, res)));
router.post('/rol', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => RolController.create(req, res)));
router.put('/rol/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => RolController.update(req, res)));
router.delete('/rol/:id', verifyToken, requireRoles('admin'), asyncHandler((req: express.Request, res: express.Response) => RolController.delete(req, res)));

export default router;
