import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import { asyncHandler } from '../middleware/errorHandler';
import EstudiantePerfilController from '../controllers/EstudiantePerfilController';
import EstudiantePagosController from '../controllers/EstudiantePagosController';

const router = express.Router();

const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTS.includes(ext)) cb(null, true);
    else cb(new Error('Tipo de archivo no permitido. Use: pdf, jpg, jpeg, png, docx'));
  },
});

router.use(verifyToken);
router.use(requireRoles('estudiante'));

router.get('/perfil', asyncHandler((req: Request, res: Response, next: NextFunction) => EstudiantePerfilController.get(req, res, next)));
router.put('/perfil', asyncHandler((req: Request, res: Response, next: NextFunction) => EstudiantePerfilController.update(req, res, next)));
router.patch('/perfil/archivo', upload.single('archivo'), asyncHandler((req: Request, res: Response, next: NextFunction) => EstudiantePerfilController.updateArchivo(req, res, next)));

router.get('/pagos', asyncHandler((req: Request, res: Response, next: NextFunction) => EstudiantePagosController.get(req, res, next)));
router.post('/pagos/comprobante', upload.single('comprobante'), asyncHandler((req: Request, res: Response, next: NextFunction) => EstudiantePagosController.subirComprobante(req, res, next)));

export default router;
