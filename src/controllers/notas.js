/* eslint-disable class-methods-use-this */
/**
 * CONTROLADOR DE NOTAS
 */

// Librerias
import Nota from '../models/notas';
// const File = require('../models/files').FileModel;
// const env = require('../env');

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
    // Por si queremos buscar por un campo
    const searchOptions = {
      search_field: req.query.search_field || 'titulo', // Campo por defecto para la búsqueda
      search_content: req.query.search_content || '',
      search_order: req.query.search_order || 'asc',
    };

    try {
      const data = await Nota().getAll(pageOptions, searchOptions);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send(err);
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
          mensaje: `No se ha encontrado ninguna item con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: `Error: ${err}`,
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
      descripcion: req.body.descripcion,
      usuarioId: req.body.usuarioId,
      fecha: req.body.fecha,
      activo: req.body.activo,
      fichero: req.body.fichero,
    });
    try {
      const data = await newNota.save();
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: `Error: ${err}`,
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
      descripcion: req.body.descripcion,
      usuarioId: req.body.usuarioId,
      fecha: req.body.fecha,
      activo: req.body.activo,
      fichero: req.body.fichero,
    };
    try {
      const data = await Nota().findOneAndUpdate({ _id: req.params.id }, newNota);
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
        mensaje: `Error: ${err}`,
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
        mensaje: `Error: ${err}`,
      });
    }
  }
}

// Exportamos el módulo
export default new NotasController();
