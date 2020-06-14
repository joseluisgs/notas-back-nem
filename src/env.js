/* eslint-disable max-len */
/* eslint-disable radix */
/**
 * CONFIGURACIÓN DE LOS DATOS Y VARIABLES DE ENTORno
 * Pueden llegar de un fichero .env, o desde el propio entorno de desarrollo
 */

// Librerías
const conf = require('dotenv');
// Cogemos el objeto que necesitamos .env
conf.config(); // Toda la configuración parseada del fichero .env

// Filtramos que estos parámetros importantes para la ejecución estén para MongoDB
const paramsMongoBD = process.env.DB_USER && process.env.DB_PASS && process.env.DB_URL && process.env.DB_PORT && process.env.DB_NAME;
if (!paramsMongoBD) {
  console.error('✕ Error: Faltán variables de entorno para la ejecución en MongoDB. Por favor revise su fichero .env');
  process.exit();
}

// Filtreamos la configuracion de Firebase
const paramsFirebase = process.env.TYPE && process.env.PROJECT_ID && process.env.PRIVATE_KEY_ID && process.env.PRIVATE_KEY && process.env.CLIENT_EMAIL && process.env.CLIENT_ID && process.env.AUTH_URI && process.env.TOKEN_URI && process.env.AUTH_PROVIDER_X509_CERT_URL && process.env.CLIENT_X509_CERT_URL && process.env.BUCKET_NAME;
if (!paramsFirebase) {
  console.error('✕ Error: Faltán variables de entorno para la ejecución en Firebase. Por favor revise su fichero .env');
  process.exit();
}
// Variable de configuración de firebase
const serviceFirebase = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

// Es importante que pongamos unos valores por defecto por si no están en el .env o defnidos en el sistema
const env = {
  // GENERAL
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.ENV || 'development',
  DEBUG: process.env.DEBUG || true,
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 8000,
  TIMEZONE: process.env.TIMEZONE || 'Europe/Madrid',
  // TOKEN
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Este_Caballo_Viene_de_Boanzarrrrr_/_Lorem_Fistrum_Pecador_Te_Va_A_Haser_Pupitaa_Diodenaaalll_2020',
  TOKEN_LIFE: process.env.TOKEN_LIFE || 20,
  TOKEN_REFRESH: process.env.TOKEN_REFRESH || 40,
  // CIFRADO
  BC_SALT: parseInt(process.env.BC_SALT) || 10,
  // MONGODB
  DB_DEBUG: process.env.DB_DEBUG || '', // puede ser true
  DB_POOOLSIZE: process.env.DB_POOLSIZE || 200,
  DB_PROTOCOL: process.env.DB_PROTOCOL,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_URL: process.env.DB_URL,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  // FICHEROS
  FILE_SIZE: process.env.FILE_SIZE || 2,
  FILES_PATH: process.env.FILES_PATH || 'files',
  FILES_URL: process.env.FILES_URL || 'files',
  // FIREBASE
  FIREBASE_SERVICE: serviceFirebase,
  FIREBASE_BUCKET: 'notas-vue.appspot.com',
};

export default env;
