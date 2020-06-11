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
              mensaje: 'Usuario o password incorrectos',
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
            mensaje: 'Error: Problemas al identificar el usuario. No ha indicado su email o su contraseña',
            detalles: err,
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
      if (req.user) {
        res.status(204)
          .send(
            {
              user: req.user,
            },
          );
      } else {
        res
          .status(401)
          .send(
            {
              error: '401',
              mensaje: 'Usuario no identificado o sesión terminada',
            },
          );
      }
    } catch (err) {
      res.status(500)
        .send(
          {
            error: '500',
            mensaje: 'Problemas al identificar el usuario, no ha proporcionado el nombre de usuario',
            detalles: err,
          },
        );
    }
  }

  /**
   * POST. Añade un elemento al repositorio
   * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async registerMe(req, res) {
    // Creamos el usuario
    const newUser = User()({
      username: req.body.username,
      email: req.body.email,
      password: (req.body.password ? bcrypt.hashSync(req.body.password, env.BC_SALT) : ''),
      role: req.body.role || 'USER',
      avatar: req.body.avatar || null,
      fecha: req.body.fecha || Date.now(),
      activo: req.body.activo || true,
    });
    try {
      const data = await newUser.save();
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'Ya existe un usuario con este username o email',
        detalles: err,
      });
    }
  }
}

// Exportamos el módulo
export default new AuthController();
