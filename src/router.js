/**
 * ENRUTADOR
 * Enrutador central
 */

// Librerias
import notas from './routes/notas';
import users from './routes/users';
import auth from './routes/auth';

const Path = '/api';

// exportamos los módulos
export default (app) => {
  // rutas de autenticación y autorización.
  app.use(`${Path}/auth`, auth);

  // Recurso notas
  app.use(`${Path}/notas`, notas);

  // Recursos usuarios
  app.use(`${Path}/users`, users);

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
