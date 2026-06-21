import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import { asyncHandler } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';
import EstudiantePerfilController from '../controllers/EstudiantePerfilController';
import EstudiantePagosController from '../controllers/EstudiantePagosController';
import ClassroomTareaController from '../controllers/ClassroomTareaController';
import ClassroomEntregaController from '../controllers/ClassroomEntregaController';
import DireccionGradoController from '../controllers/DireccionGradoController';
import { classroomEntregaCreateForEstudianteSchema } from '../validators/classroomEntrega';
import { idParamsSchema, adjuntoParamsSchema } from '../validators/params';

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

router.get('/classroom/tareas', asyncHandler((req: Request, res: Response, next: NextFunction) => ClassroomTareaController.listForEstudiante(req, res, next)));

router.get('/classroom/entregas', asyncHandler((req: Request, res: Response, next: NextFunction) => ClassroomEntregaController.listForEstudiante(req, res, next)));
router.post('/classroom/entregas', validate(classroomEntregaCreateForEstudianteSchema), asyncHandler((req: Request, res: Response, next: NextFunction) => ClassroomEntregaController.createForEstudiante(req, res, next)));
router.post('/classroom/entregas/:id/adjuntos', validate(idParamsSchema, 'params'), upload.array('files', 5), asyncHandler((req: Request, res: Response, next: NextFunction) => ClassroomEntregaController.uploadAdjuntosForEstudiante(req, res, next)));
router.delete('/classroom/entregas/:id/adjuntos/:adjuntoId', validate(adjuntoParamsSchema, 'params'), asyncHandler((req: Request, res: Response, next: NextFunction) => ClassroomEntregaController.deleteAdjuntoForEstudiante(req, res, next)));

router.get('/clase-virtual', asyncHandler((req: Request, res: Response, next: NextFunction) => DireccionGradoController.getForEstudiante(req, res, next)));

export default router;
