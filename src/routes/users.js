/**
 * ENRUTADOR DE USUARIOS
 * Enruta las peticiones al recurso de usuarios llamando al controlador y métodos adecuados
 */

import express from 'express';
import usersController from '../controllers/users';
import { auth, grant } from '../middlewares/auth';

// Cargamos el enrutador
const router = express.Router();

// Esta ruta está protegida en todos los elementos:
// - Autenticados
// - Autorizados como ADMIN

// GET Listar todos los elementos, solo admin puede
router.get('/', auth, grant(['ADMIN']), usersController.users);

// GET Obtiene un elemento por por ID
router.get('/:id', auth, grant(['ADMIN']), usersController.userById);

// POST Añadir Elemento. Solo el usuario administrador
router.post('/', auth, grant(['ADMIN']), usersController.addUser);

// PUT Modifica un elemento por ID. Solo admin
router.put('/:id', auth, grant(['ADMIN']), usersController.editUserById);

// DELETE Elimina un elemento por ID. Solo Admin puede borrarlos.
router.delete('/:id', auth, grant(['ADMIN']), usersController.deleteUserById);

// Exprotamos el módulo
export default router;
