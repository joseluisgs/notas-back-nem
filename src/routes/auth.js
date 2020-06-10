/**
 * ENRUTADOR DE AUTORIZACION
 */

import express from 'express';
import authController from '../controllers/auth';

// Cargamos el enrutador
const router = express.Router();

// Ruta POST Login
router.post('/login', authController.login);

// Ruta POST. Logout. solo autenticados
router.post('/logout', authController.logout);

// Exprotamos el módulo
export default router;
