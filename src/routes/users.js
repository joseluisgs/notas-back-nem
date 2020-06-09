/**
 * ENRUTADOR DE USUARIOS
 * Enruta las peticiones al recurso de usuarios llamando al controlador y métodos adecuados
 */


// Cargamos librerías, controladores y middleware, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import usersController from '../controllers/users';

// Cargamos el enrutador
const router = express.Router();

// GET Listar todos los elementos, solo admin puede
router.get('/', usersController.users);

// GET Obtiene un elemento por por ID
router.get('/:id', usersController.userById);

// POST Añadir Elemento. Solo el usuario administrador
router.post('/', usersController.addUser);

// PUT Modifica un elemento por ID. Solo admin
router.put('/:id', usersController.editUserById);

// DELETE Elimina un elemento por ID. Solo Admin puede borrarlos.
router.delete('/:id', usersController.deleteUserById);

// Exprotamos el módulo
export default router;
