/**
 * ENRUTADOR DE AUTORIZACION
 */

import express from 'express';
import authController from '../controllers/auth';
import { auth } from '../middlewares/auth';

// Cargamos el enrutador
const router = express.Router();

// Ruta POST Login
router.post('/login', authController.login);

// Ruta POST. Logout. solo autenticados
router.post('/logout', auth, authController.logout);

// POST Registrarse como nuevo usuario. Acceso libre
router.post('/register', authController.registerMe);

// Exprotamos el módulo
export default router;
