/**
 * ENRUTADOR DE NOTAS
 */


// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import notasController from '../controllers/notas';
import { auth } from '../middlewares/auth';

// Controladores
// const recipesController = require('../controllers/recipes');

// Cargamos el enrutador
const router = express.Router();

// Esta ruta está protegida en todos los elementos:
// - Autenticados

// GET Listar todos los elementos, podemos hacerlo todos. Si no se pone role es que esta implícito role(['user'])
router.get('/', auth, notasController.notas);

// GET Obtiene un elemento por por ID, podemos hacerlo todos
router.get('/:id', auth, notasController.notaById);

// POST Añadir Elemento. Solo autenticados y del nivel admin, por eso no se pone nada (es por defecto)
router.post('/', auth, notasController.addNota);

// PUT Modifica un elemento por ID. Solo autenticados y del nivel admin, por eso no se pone nada (es por defecto)
router.put('/:id', auth, notasController.editNotaById);

// DELETE Elimina un elemento por ID. Solo autenticados y del nivel admin podrán, por eso no se pone nada (es por defecto)
router.delete('/:id', auth, notasController.deleteNotaById);

// Exprotamos el módulo
export default router;
