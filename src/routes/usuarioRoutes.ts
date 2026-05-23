import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import tipoDocumentoController from '../controllers/TipoDocumentoController';
import UsuarioController from '../controllers/UsuarioController';
import RolController from '../controllers/RolController';

const router = express.Router();

// Usuario
router.get('/usuario', asyncHandler((req: express.Request, res: express.Response) => UsuarioController.list(req, res)));
router.get('/usuario/:id', asyncHandler((req: express.Request, res: express.Response) => UsuarioController.get(req, res)));
router.post('/usuario', asyncHandler((req: express.Request, res: express.Response) => UsuarioController.create(req, res)));
router.put('/usuario/:id', asyncHandler((req: express.Request, res: express.Response) => UsuarioController.update(req, res)));
router.delete('/usuario/:id', asyncHandler((req: express.Request, res: express.Response) => UsuarioController.delete(req, res)));


router.get('/tipo_documento', asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.list(req, res)));
router.get('/tipo_documento/:id', asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.get(req, res)));
router.post('/tipo_documento', asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.create(req, res)));
router.put('/tipo_documento/:id', asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.update(req, res)));
router.delete('/tipo_documento/:id', asyncHandler((req: express.Request, res: express.Response) => tipoDocumentoController.delete(req, res)));

// Rol
router.get('/rol', asyncHandler((req: express.Request, res: express.Response) => RolController.list(req, res)));
router.get('/rol/:id', asyncHandler((req: express.Request, res: express.Response) => RolController.get(req, res)));
router.get('/rol/name/:name', asyncHandler((req: express.Request, res: express.Response) => RolController.getByName(req, res)));
router.post('/rol', asyncHandler((req: express.Request, res: express.Response) => RolController.create(req, res)));
router.put('/rol/:id', asyncHandler((req: express.Request, res: express.Response) => RolController.update(req, res)));
router.delete('/rol/:id', asyncHandler((req: express.Request, res: express.Response) => RolController.delete(req, res)));

export default router;
