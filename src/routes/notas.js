/**
 * ENRUTADOR DE NOTAS
 */


// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';

// Controladores
// const recipesController = require('../controllers/recipes');

// Cargamos el enrutador
const router = express.Router();

// Para securizar ponemos auth en la ruta que queramos.
// const { auth } = require('../middlewares/auth'); // es equivalente a poner const auth = requiere ('...').auth;
// const { role } = require('../middlewares/auth');

// GET Listar todos los elementos, podemos hacerlo todos. Si no se pone role es que esta implícito role(['user'])
router.get('/', notasController.notas);

// GET Obtiene un elemento por por ID, podemos hacerlo todos
router.get('/:id', notasController.notaById);

// POST Añadir Elemento. Solo autenticados y del nivel admin, por eso no se pone nada (es por defecto)
router.post('/', notasController.addNota);

// PUT Modifica un elemento por ID. Solo autenticados y del nivel admin, por eso no se pone nada (es por defecto)
router.put('/:id', notaController.editNotaById);

// DELETE Elimina un elemento por ID. Solo autenticados y del nivel admin podrán, por eso no se pone nada (es por defecto)
router.delete('/:id', notasController.deleteNotaById);

// Exprotamos el módulo
export default router;
