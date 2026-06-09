import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { verifyToken } from './middleware/auth';
import { requireRoles } from './middleware/roles';
import setupDatabase from './database/setup';
import routerAuth from './routes/authRoutes';
import routerUsuario from './routes/usuarioRoutes';
import routerAcademico from './routes/academicoRoutes';
import routerCatalogo from './routes/catalogoRoutes';
import routerDocente from './routes/docenteRoutes';
import routerGestion from './routes/gestionRoutes';
import routerMatricula from './routes/matriculaRoutes';
import config from './config/environment.js';
import { EmailService } from './utils/sendEmail';

const app: Application = express();

async function bootstrap() {
  // Initialize DB (create tables + seed data)
  await setupDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/auth', routerAuth);
  app.use('/api/matriculas', routerMatricula);
  // Rutas públicas de catálogos (usadas por el formulario de matrícula)
  app.use('/api/academico', routerAcademico);
  app.use('/api/catalogo', routerCatalogo);
  // Rutas académicas (docentes, calificaciones, asistencias, classroom)
  app.use('/api/docente', routerDocente);
  // Rutas protegidas — solo admin
  app.use('/api/usuario', routerUsuario);
  app.use('/api/gestion', verifyToken, routerGestion);

  // Health check
  app.get('/api/health', (req : express.Request, res : express.Response) => {
    res.status(200).json({
      success: true,
      data: { message: 'Server is running' },
      error: null,
    });
  });
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Route not found' },
    });
  });

  // Error handler middleware
  app.use(errorHandler);

  // Start server
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
