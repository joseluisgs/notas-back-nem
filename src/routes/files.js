/**
 * ENRUTADOR DE FICHEROS
 */

import express from 'express';
import filesController from '../controllers/files';
// import { auth } from '../middlewares/auth';

// Cargamos el enrutador
const router = express.Router();

// GET de Ficheros, autenticado sy solo admin
router.get('/', filesController.files);

// GET de Fichero dado su ID, autenticado
router.get('/:id', filesController.fileById);

// POST. añade un fichero
router.post('/', filesController.addFile);

// // DELETE Elimina un fichero dado su id. Solo autenticado
// router.delete('/:id', authController.registerMe);

// Exprotamos el módulo
export default router;
