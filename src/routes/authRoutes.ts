import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken } from '../middleware/auth';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.post('/login', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AuthController.login(req, res, next)));
router.post('/refresh', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AuthController.refresh(req, res, next)));
router.post('/logout', verifyToken, asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AuthController.logout(req, res, next)));
router.post('/recuperar-password', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AuthController.solicitarRecuperacion(req, res, next)));
router.post('/verificar-codigo', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AuthController.verificarCodigo(req, res, next)));
router.post('/nueva-password', asyncHandler((req: express.Request, res: express.Response, next: express.NextFunction) => AuthController.nuevaPassword(req, res, next)));

export default router;
