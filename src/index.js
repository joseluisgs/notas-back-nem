
/**
 * Mi servidor
 */
import express from 'express';
import path from 'path';
import history from 'connect-history-api-fallback';
import env from './env';
import config from './config';
import router from './router';
import db from './database';

/**
 * Clase siguiendo un patrón singleton, es decir, por muchas veces que se llamen, por ejemplo en las pruebas devolvemos el mismo.
 */
class Server {
  // iniciamos el servidor
  constructor() {
    this.app = express();
    this.mongoDB = false;
  }

  // eslint-disable-next-line consistent-return
  start() {
    // Cargamos express como servidor
    // Si no hay conexión a la base de datos no arancamos
    this.mongoDB = db.connect(); // Por si quiero poner algo para avisar que se conecta .then(() => console.log('⚑ Conectado a Servidor Mongo ✓'));

    if (this.mongoDB) {
      // Le añadimos la configuración
      config(this.app);
      // Enrutamiento que hemos creado
      router(this.app);

      // Configuracion del modo historia para
      // web app SPA como Vue en este modo
      this.app.use(history());
      this.app.use(express.static(path.join(__dirname, 'public')));

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
      return this.instancia;
    }
    console.error('✕ Error al crear el servidor');
    process.exit();
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
