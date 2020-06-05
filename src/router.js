/**
 * ENRUTADOR
 * Enrutador central
 */


// exportamos los módulos
module.exports.setRouter = (app) => {
  // indicamos que para ruta quien la debe resolver
  app.get('/', (req, res) => {
    res.status(200).send('Hello Back end!');
  });


};
