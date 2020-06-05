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

router.get('/', (req, res) => {
  res.status(200).send('Hola notas');
});

// Exprotamos el módulo
export default router;
