/* eslint-disable class-methods-use-this */
/**
 * CONFIGURACIÓN DE ACESO A FIREBASE
 * Configuración de Firebase
 */

// Librerías
import env from './env';


/**
 * configuración de conexión a Firebase
 */
class Firebase {
  /**
   * Se conecta a la conexión indicada. Se realiza por promesas, es decir, hasta que no se cumpla la promesa, espera el proceso del servidor
   */
  start() {
    // Definimos una promesa que se resollverá si nos conecatmos correctamente
    return new Promise((resolve) => {
      // Inicializamos Firebase Storage con el repositorio que nos da la consola
      if (env.FIREBASE_SERVICE.app) {
        console.log('⚑ Servicios de Firebase activos ✓');
        resolve();
      } else {
        console.error('✕ Error: No se ha podido iniciar los servicios de Firebase');
        return process.exit();
      }
    });
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const instance = new Firebase();

// Devolvemos el módulo
export default instance;
