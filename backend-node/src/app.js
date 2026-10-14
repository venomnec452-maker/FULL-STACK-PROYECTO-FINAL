import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { ENV } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { successResponse } from './utils/apiResponse.js';

import authRoutes from './routes/authRoutes.js';

const app = express();

// 1. Seguridad: Cabeceras HTTP con Helmet
app.use(helmet());

// 2. Seguridad: CORS restrictivo
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true, // Permite intercambio de cookies HttpOnly con React
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Idempotency-Key', 'x-internal-api-key'],
  })
);

// 3. Rate Limiter: Protección contra ataques de fuerza bruta y saturación
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Máximo 300 peticiones por IP en la ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta dirección IP. Por favor intente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 4. Parseo de cuerpo de solicitudes y cookies
app.use(express.json({ limit: '10kb' })); // Previene ataques de denegación de servicio por payloads gigantes
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 5. Registro de solicitudes HTTP en consola (solo en desarrollo)
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 6. Endpoint de verificación de estado (Healthcheck)
app.get('/api/health', (req, res) => {
  return successResponse(res, {
    message: 'StockMaster Backend API operativa y saludable',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
      version: '1.0.0',
    },
  });
});

// 7. Montaje de rutas base /api/v1
app.get('/api/v1', (req, res) => {
  return successResponse(res, {
    message: 'StockMaster Core API RESTful v1',
    data: {
      documentation: '/api/v1/docs',
      modules: ['auth', 'products', 'categories', 'suppliers', 'inventory', 'reports'],
    },
  });
});

// Rutas de autenticación y sesiones
app.use('/api/v1/auth', authRoutes);

// 8. Manejadores de rutas no encontradas y errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
