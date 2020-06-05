/* eslint-disable class-methods-use-this */
/**
 * Mi servidor
 */
import express from 'express';
import path from 'path';
import history from 'connect-history-api-fallback';
import env from './env';
import config from './config';
import router from './router';


let instancia; // instancia del servidor. Singleton

/**
 * Clase siguiendo un patrón singleton, es decir, por muchas veces que se llamen, por ejemplo en las pruebas devolvemos el mismo.
 */
class Server {
  // iniciamos el servidor
  start() {
    // Cargamos express como servidor
    const app = express();
    let mongoOK = false;

    // Si no hay conexión a la base de datos no arancamos
    mongoOK = true; // db.connect().then(() => true);// Fin de la promesa

    if (mongoOK) {
      config.setConfig(app);

      // Enrutamiento que hemos creado
      // Enrutamiento que hemos creado
      router.setRouter(app);

      // Configuracion del modo historia para
      // web app SPA como Vue en este modo
      app.use(history());
      app.use(express.static(path.join(__dirname, 'public')));


      // Nos ponemos a escuchar a un puerto definido en la configuracion
      instancia = app.listen(env.PORT, () => {
        const address = instancia.address(); // obtenemos la dirección
        const host = address.address === '::' ? 'localhost' : address; // dependiendo de la dirección asi configuramos
        const port = env.PORT; // el puerto
        const url = `http://${host}:${port}`;
        instancia.url = url;

        if (process.env.NODE_ENV !== 'test') {
          console.log(`⚑ Servidor API REST escuchando ✓ -> ${url}`);
        }
      });
      return instancia;
    }
    return null;
  }

  // Cierra el servidor
  close() {
    // Desconectamos el socket server
    instancia.close();
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
