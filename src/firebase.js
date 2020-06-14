/* eslint-disable class-methods-use-this */
/**
 * CONFIGURACIÓN DE ACESO A FIREBASE
 * Configuración de Firebase
 */

// Librerías
import admin from 'firebase-admin';
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
      admin.initializeApp({
        credential: admin.credential.cert(env.FIREBASE_SERVICE),
        storageBucket: process.env.BUCKET_NAME,
      });
      console.log('⚑ Servicios de Firebase activos ✓');
      resolve();
    });
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const instance = new Firebase();

// Devolvemos el módulo
export default instance;
