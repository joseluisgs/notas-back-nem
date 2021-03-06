/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/**
 * CONTROLADOR DE NOTAS
 */

// Librerias
import Nota from '../models/notas';

class NotasController {
  /**
   * GET all. Devueleve una lista con todas los elementos del repositorio
   * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  async notas(req, res) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    // Por si queremos buscar por un campo, este caso nosotros vamos a fiultrar las notas por id de usuario y no lo vamos a dejar al azar
    // en vez de psarle estos parámetros por la barra de direcciones.
    const searchOptions = {
      search_field: 'usuarioId', // req.query.search_field || 'titulo', // Campo por defecto para la búsqueda
      search_content: req.user._id, // req.query.search_content || '',
      search_order: req.query.search_order || 'asc',
    };

    try {
      const data = await Nota().getAll(pageOptions, searchOptions);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha pidido obtener la lista de notas',
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
  async notaById(req, res) {
    try {
      const data = await Nota().getById(req.params.id);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado ninguna nota con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido obtener la nota',
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
  async addNota(req, res) {
    // Creamos la receta
    const newNota = Nota()({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion || '',
      usuarioId: req.user._id, // La nota es del usuario identificado
      fecha: req.body.fecha || Date.now(),
      activo: req.body.activo || true,
      fichero: req.body.fichero || '',
    });
    try {
      const data = await newNota.save();
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido añadir la nota',
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
  async editNotaById(req, res) {
    const newNota = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion || '',
      usuarioId: req.user._id, // La nota es del usuario identificado
      fecha: req.body.fecha || Date.now(),
      activo: req.body.activo || true,
      fichero: req.body.fichero || '',
    };
    try {
      const data = await Nota().findOneAndUpdate({ _id: req.params.id }, newNota, { new: true });
      // {new:true} nos devuelve el usuario actualizado por lo que no hace falta buscarlo como se hace despues
      if (data) {
        // Devolvemos los datos nuevos
        // data = await Nota().getById(req.params.id);
        res.status(200).json(data);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado una nota con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido editar la nota',
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
  async deleteNotaById(req, res) {
    try {
      const data = await Nota().findByIdAndDelete({ _id: req.params.id });
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
        mensaje: 'No se ha podido eliminar la nota',
        detalles: err,
      });
    }
  }
}

// Exportamos el módulo
export default new NotasController();
