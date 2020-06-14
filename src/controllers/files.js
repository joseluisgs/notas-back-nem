/* eslint-disable class-methods-use-this */
/**
 * CONTROLADOR DE FICHEROS
 * Controlador de usuarios para realizar los métodos que le indiquemos a través del enrutador.
 */

// Librerías
import fs from 'fs';
import { v1 as uuidv1 } from 'uuid';
import mime from 'mime-types';
import env from '../env';

class FilesController {
  /**
     * GET all. Devueleve una lista con todas los ficheros
     * Códigos de Estado: 200 (OK), 404 No encotrado, 500 no permitido.
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
  async files(req, res) {
    try {
      const bucket = env.FIREBASE_BUCKET;
      const data = await bucket.getFiles();
      const lista = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const fichero of data[0]) {
        const fi = {
          id: fichero.id,
          name: fichero.name,
          url: (`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fichero.name)}?alt=media&token=${fichero.metadata.metadata.firebaseStorageDownloadTokens}`),
          metadata: fichero.metadata,
        };
        lista.push(fi);
      }
      res.status(200).json(lista);
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido obtener la lista de ficheros',
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
  async fileById(req, res) {
    try {
      const bucket = env.FIREBASE_BUCKET;
      const file = await bucket.file(req.params.id);
      console.log(file.id);
      console.log(file.name);
      console.log(file.metadata);
      if (file) {
        res.status(200).json(file);
      } else {
        res.status(404).json({
          error: 404,
          mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
        });
      }
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido obtener el fichero',
        detalles: err,
      });
    }
  }

  /**
   * POST. Añade una imagen al directorio file
   * Códigos de estado: 201, añadido el recurso. 400 Bad request. 500 no permitido
   * Asincrono para no usar promesas asyn/await
   * @param {*} req Request
   * @param {*} res Response
   * @param {*} next Next function
   */
  // eslint-disable-next-line consistent-return
  async addFile(req, res) {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        res.send({
          status: 400,
          message: 'No hay fichero para subir',
        });
      }
      const { file } = req.files;
      let fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
      const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
      fileName = `${file.md5}.${fileExt}`; // this.getStorageName(file);
      const token = uuidv1();
      const fileMime = mime.lookup(fileName);
      file.mv(env.STORAGE + fileName);
      const bucket = env.FIREBASE_BUCKET;
      // Lo subimos
      return bucket.upload(env.STORAGE + fileName, {
        destination: fileName,
        uploadType: 'media',
        metadata: {
          contentType: fileMime,
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      })
        .then((data) => {
          const fichero = data[0];
          bucket.file(file.name).makePublic(); // Hacemos publico en storage
          // Lo borramos
          const fi = {
            id: fichero.id,
            name: fichero.name,
            url: (`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`),
            metadata: fichero.metadata,
          };
          fs.unlinkSync(env.STORAGE + fileName);
          return res.status(200).json(fi);
        });
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido añadir el fichero',
        detalles: err,
      });
    }
  }
}


// Exportamos el módulo
export default new FilesController();
