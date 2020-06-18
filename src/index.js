
/**
 * Mi servidor
 */
import express from 'express';
import env from './env';
import config from './config';
import router from './router';
import db from './database';
import firebase from './firebase';

/**
 * Clase siguiendo un patrón singleton, es decir, por muchas veces que se llamen, por ejemplo en las pruebas devolvemos el mismo.
 */
class Server {
  // iniciamos el servidor
  constructor() {
    // Cargamos express como servidor
    this.app = express();
    this.mongoDB = null;
    this.firebase = null;
  }

  // eslint-disable-next-line consistent-return
  async start() {
    // Comprbamos si se ha inciiado MongoDB
    this.mongoDB = await db.connect();

    // Comprobamos que se ha iniciado Firebase
    this.firebase = await firebase.start();

    // Le apliacamos la configuracion
    config(this.app);

    // Enrutamiento que hemos creado
    router(this.app);

    // Nos ponemos a escuchar a un puerto definido en la configuracion
    this.instancia = this.app.listen(env.PORT, () => {
      const address = this.instancia.address(); // obtenemos la dirección
      const host = address.address === '::' ? 'localhost' : address; // dependiendo de la dirección asi configuramos
      const port = env.PORT; // el puerto
      const url = `http://${host}:${port}`;
      this.instancia.url = url;

      if (process.env.NODE_ENV !== 'test') {
        console.log(`⚑ Servidor API REST escuchando ✓ -> ${url}`);
      }
    });
    return this.instancia; // Devolvemos la instancia del servidor
  }

  // Cierra el servidor
  close() {
    // Desconectamos el socket server
    this.instancia.close();
    if (process.env.NODE_ENV !== 'test') {
      console.log('▣  Servidor parado');
    }
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const server = new Server();

// Exportamos la variable
export default server;

// Si ningun fichero está haciendo un import y ejecutando ya el servidor, lo lanzamos nosotros
if (!module.parent) {
  server.start();
}

process.on('unhandledRejection', (err) => {
  console.log('✕ Custom Error: An unhandledRejection occurred');
  console.log(`✕ Custom Error: Rejection: ${err}`);
});
