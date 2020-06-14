/**
 * ENRUTADOR
 * Enrutador central
 */

// Librerias
import notas from './routes/notas';
import users from './routes/users';
import auth from './routes/auth';
import files from './routes/files';

const Path = '/api';

// exportamos los módulos
export default (app) => {
  // rutas de autenticación y autorización.
  app.use(`${Path}/auth`, auth);

  // Recurso notas
  app.use(`${Path}/notas`, notas);

  // Recurso usuarios
  app.use(`${Path}/users`, users);

  // Recurso fichero
  app.use(`${Path}/files`, files);

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
