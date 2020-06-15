/* eslint-disable max-len */
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
          // metadata: fichero.metadata,
          url: (`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fichero.name)}?alt=media&token=${fichero.metadata.metadata.firebaseStorageDownloadTokens}`),
          // Serían los metadato del fichero segun Google Firebase
          // metadata: fichero.metadata,
          // Ponemos los metadatos que queremos para no volcar los de google
          contentType: fichero.metadata.contentType,
          size: fichero.metadata.size,
          md5Hash: fichero.metadata.md5Hash,
          timeCreated: fichero.metadata.timeCreated,
          updated: fichero.metadata.updated,
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
      // El motivo de hacer esto es mapear las peticion y no sepan que están en Firebase.
      // Podíamos quitar la url poner esta y eliminar cualquier rastro de firebase
      const file = await bucket.file(req.params.id).download();
      if (file) {
        res.status(200).send(file[0]);
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
        // Como notas y suario solo tienen una imagen el nombre finalmente será el id. Si no dejar fileName
        destination: `${req.body.id}.${fileExt}` || fileName,
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
          bucket.file(fileName).makePublic(); // Hacemos publico en storage
          // Lo borramos
          const fi = {
            id: fichero.id,
            name: fichero.name,
            // Quitamos la URL ya que la podemos ecnapsular con nuestro propio método GET
            url: (`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`),
            // Serían los metadato del fichero segun Google Firebase
            // metadata: fichero.metadata,
            // Ponemos los metadatos que queremos para no volcar los de google
            contentType: fichero.metadata.contentType,
            size: fichero.metadata.size,
            md5Hash: fichero.metadata.md5Hash,
            timeCreated: fichero.metadata.timeCreated,
            updated: fichero.metadata.updated,
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

  /**
     * Elimina un elemento en base a su ID.
     * Códigos de estado: 200, OK, o 204, si no devolvemos nada 400 Bad request. 500 no permitido
     * Asincrono para no usar promesas asyn/await
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next Next function
     */
  // eslint-disable-next-line consistent-return
  async deleteFileById(req, res) {
    try {
      // Busco el fichero y lo borro
      const bucket = env.FIREBASE_BUCKET;
      const file = await bucket.file(req.params.id);
      const ok = await file.delete();
      if (ok) {
        return res.status(200).send(file.getMetadata());
      }
      res.status(404).json({
        error: 404,
        mensaje: `No se ha encontrado un item con ese ID: ${req.params.id}`,
      });
    } catch (err) {
      res.status(500).json({
        error: 500,
        mensaje: 'No se ha podido eliminar el fichero',
        detalles: err,
      });
    }
  }
}


// Exportamos el módulo
export default new FilesController();
