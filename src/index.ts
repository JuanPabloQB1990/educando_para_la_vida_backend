import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.ts';
import setupDatabase from './database/setup.ts';
import routerUsuario from './routes/usuarioRoutes.ts';
import routerAcademico from './routes/academicoRoutes';
import routerGestion from './routes/gestionRoutes';
import routerMatricula from './routes/matriculaRoutes';

const app: Application = express();

async function bootstrap() {
  // Initialize DB (create tables + seed data)
  await setupDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/usuario', routerUsuario);
  app.use('/api/academico', routerAcademico);
  app.use('/api/gestion', routerGestion);
  app.use('/api/matriculas', routerMatricula);

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
