/**
 * ENRUTADOR
 * Enrutador central
 */

// Librerias
import notas from './routes/notas';

// exportamos los módulos
export default (app) => {

  // Recurso notas
  app.use('/api/notas', notas);

  // Hola API
  // indicamos que para ruta quien la debe resolver
  app.get('/api', (req, res) => {
    res.status(200).send('Hola API!');
  });

  // indicamos que para ruta quien la debe resolver
  app.get('/', (req, res) => {
    res.status(200).send('Hola Back end!');
  });
};
