/* eslint-disable class-methods-use-this */
/**
 * CONTROLADOR DE AUTENTICACIÓN
 * Controlador de autenticación.
 */


// Librerias
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import env from '../env';
import User from '../models/users';

// Tenemos dos formas si usa Query Params: localhost:8000/auth/login?email=corre@correo.com
// Debemos usar req.query.email
// Si usa el body con un JSON: localhost:8000/auth/login,
// usamos req.body.email
// Voy a obtar por este último método

// Autentificación
class AuthController {
  /**
   * Devuelve un token al usuario si se autentica correctamente. Genera el token de refresco
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async login(req, res) {
    // Tenemos dos formas depasar los datos. si usa Query Params: localhost:8000/auth/login?email=corre@correo.com. Debemos usar req.query.email
    // Si usa el body con un JSON: localhost:8000/auth/login. Debemos usar req.body.email
    const { email, password } = req.body; // Los tomo ambos del tiron

    // Aquí deberíamos hacer las comprobaciones de que existe ese usuario en la BD o que las contraseñas son correctas, etc.
    try {
      const user = await User().getByEmail(email);
      // Si no existe o no se encuetra, o no coiciden
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .send(
            {
              error: '401',
              message: 'Usuario o password incorrectos',
            },
          );
      }
      console.log(user.username);
      // Devolvemos lo que tengamos que devolver.
      // Costruimos el token de acceso
      const payload = {
        user,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * env.TOKEN_LIFE),
      };
      const token = jwt.encode(payload, env.TOKEN_SECRET);
      // Devolvemos el token y el usuario, aunque el usuario también va en el token. 
      return res
        .status(200)
        .send({
          user,
          token,
        });
    } catch (err) {
      return res.status(500)
        .send(
          {
            error: '500',
            message: 'Error: Problemas al identificar el usuario. No ha indicado su email o su contraseña',
          },
        );
    }
  }

  /**
   * Realiza el logout y elimina el token de refresco
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async logout(req, res) {
    // Le pasamos el refress por body y el usuario
    try {
      // const data = await User().getByUserName(req.user.username);
      // debe coicidir el nombre del usuario con los datos de autorización
      if (req.body.username === req.user.username) {
        res.status(204)
          .send(
            {
              error: '204',
              message: 'Logout',
              user: req.user,
            },
          );
      } else {
        res
          .status(401)
          .send(
            {
              error: '401',
              message: 'Usuario no identificado o sesión terminada',
            },
          );
      }
    } catch (err) {
      res.status(500)
        .send(
          {
            error: '500',
            message: 'Error: Problemas al identificar el usuario, no ha proporcionado el nombre de usuario',
          },
        );
    }
  }
}

// Exportamos el módulo
export default new AuthController();
