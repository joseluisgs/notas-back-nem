/**
 * ENRUTADOR DE FICHEROS
 */

import express from 'express';
import authController from '../controllers/auth';
import { auth } from '../middlewares/auth';

// Cargamos el enrutador
const router = express.Router();

// GET de Ficheros, autenticado sy solo admin
router.get('/', authController.login);

// GET de Fichero dado su ID, autenticado
router.get('/:id', authController.login);

// POST. añade un fichero
router.post('/', auth, authController.logout);

// DELETE Elimina un fichero dado su id. Solo autenticado
router.delete('/:id', authController.registerMe);

// Exprotamos el módulo
export default router;
