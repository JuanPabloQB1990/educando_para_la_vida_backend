import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.post('/login', asyncHandler((req: express.Request, res: express.Response) => AuthController.login(req, res)));
router.post('/refresh', asyncHandler((req: express.Request, res: express.Response) => AuthController.refresh(req, res)));
router.post('/logout', verifyToken, asyncHandler((req: express.Request, res: express.Response) => AuthController.logout(req, res)));
router.post('/recuperar-password', asyncHandler((req: express.Request, res: express.Response) => AuthController.solicitarRecuperacion(req, res)));
router.post('/verificar-codigo', asyncHandler((req: express.Request, res: express.Response) => AuthController.verificarCodigo(req, res)));
router.post('/nueva-password', asyncHandler((req: express.Request, res: express.Response) => AuthController.nuevaPassword(req, res)));

export default router;
