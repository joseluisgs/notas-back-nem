/**
 * CONTROLADOR DE USUARIOS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */
import bcrypt from 'bcryptjs';
import User from '../models/users';
import env from '../env';


/* eslint-disable class-methods-use-this */

class UsersController {
  /**
   * GET all. Devueleve una lista con todas los elementos del repositorio
   * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async users(req, res) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    // Por si queremos buscar por un campo
    const searchOptions = {
      search_field: req.query.search_field || 'username', // Campo por defecto para la búsqueda
      search_content: req.query.search_content || '',
      search_order: req.query.search_order || 'asc',
    };

    try {
      const data = await User().getAll(pageOptions, searchOptions);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podiod obtener la lista de usuarios',
        detalles: err,
      });
    }
  }

  /**
   * GET por id. Devuelve uneun elemento en base a su ID
   * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async userById(req, res) {
    try {
      const data = await User().getById(req.params.id);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un usuario con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido obtener los detalles del usuario',
        detalles: err,
      });
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
  async addUser(req, res) {
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
        mensaje: 'No se ha podido añadir este usuario',
        detalles: err,
      });
    }
  }

  /**
   * PUT por id. Modifica un elemento en base a su id
   * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async editUserById(req, res) {
    try {
      // Buscamos el antiguo
      const oldUser = await User().getById(req.params.id);
      if (oldUser) {
        const newUser = {
          username: req.body.username || oldUser.username,
          email: req.body.email || oldUser.password,
          password: (req.body.password ? bcrypt.hashSync(req.body.password, env.BC_SALT) : oldUser.password),
          role: req.body.role || oldUser.role,
          avatar: req.body.avatar || oldUser.avatar,
          fecha: req.body.fecha || oldUser.fecha,
          activo: req.body.activo || oldUser.activo,
        };
        const data = await User().findOneAndUpdate({ _id: req.params.id }, newUser, { new: true, runValidators: true, context: 'query' });
        // Agregaremos otra opción a nuestra actualización para que corra las validaciones (para que no se puedan ingresar roles inválidos)
        // al decirle query no comprueba todo
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un usuario con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido añadir este usuario',
        detalles: err,
      });
    }
  }

  /**
   * Elimina un elemento en base a su ID.
   * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async deleteUserById(req, res) {
    try {
      const data = await User().findByIdAndDelete({ _id: req.params.id });
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'no se ha podido eliminar este usuario',
        detalles: err,
      });
    }
  }
}

// Exportamos el módulo
export default new UsersController();
