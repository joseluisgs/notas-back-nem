/**
 * MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACION
 * analiza las autorización y autenticaciones entre request y response
 */

// Librerías
// Librerías
import jwt from 'jwt-simple';
import env from '../env';

/**
 * Autenticación. Comprueba que el JWT es válido
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Next function
 */
const auth = (req, res, next) => {
  // Si la cabecera no tiene un token válido
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: '401',
      mensaje: 'No Autenticado',
    });
  }

  // Si tiene cabecera de autenticación descodificamos los token y payload.
  const token = req.headers.authorization.split(' ')[1];
  try {
    const payload = jwt.decode(token, env.TOKEN_SECRET);
    // Recuperamos el usuario del payload
    req.user = payload.user;
    // Vamos a la siguiente ruta o función
    return next();
    // Si no casca es que ha expirado
  } catch (e) {
    return res.status(401).send({
      error: '401',
      mensaje: 'La sesión ha caducado',
    });
  }
};

/**
 * Autorizacion. Permitimos que pueda acceder dependiendo de una lista de roles. Por defecto tenemos el rol normal o user
 * @param {*} role. Es una rray con los permisos, por si queremos tener varios y no mirar el menor de ellos
 */
// eslint-disable-next-line consistent-return
const grant = (role = ['USER']) => (req, res, next) => {
  // Devolvemos el middleware
  // Comprobamos que el rol del usuario existe en la lista de roles permitidos de una manera elegante :)
  const valid = role.some((rol) => rol === req.user.role);
  if (valid) {
    next(); // pasamos a la siguiente...
  } else {
    // Si no tiene el rol...
    return res.status(403).send({
      error: '403',
      mensaje: 'No Autorizado',
    });
  }
};

// Exportamos el módulo
export { auth, grant };
