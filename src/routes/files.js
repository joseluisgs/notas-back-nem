/**
 * ENRUTADOR DE FICHEROS
 */

import express from 'express';
import filesController from '../controllers/files';
import { auth, grant } from '../middlewares/auth';

// Cargamos el enrutador
const router = express.Router();

// GET de Ficheros, autenticado sy solo admin
router.get('/', auth, grant(['ADMIN']), filesController.files);

// GET de Fichero dado su ID, autenticado
router.get('/:id', filesController.fileById);

// POST. añade un fichero
router.post('/', auth, filesController.addFile);

// DELETE Elimina un fichero dado su id. Solo autenticado
router.delete('/:id', auth, filesController.deleteFileById);

// Exprotamos el módulo
export default router;
