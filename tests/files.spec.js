/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// Librerías
import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import server from '../src';

process.env.NODE_ENV = 'test';

// Configuramos chai
const { assert } = chai;
const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

// Variables globales para todas las pruebas
const Path = '/api/files';
let idFichero;
let token;

/**
 * TEST: Ficheros
 */
describe('Batería de tests de Ficheros', () => {
  let instance;

  // antes de comenzar, levantamos el servidor, cambo befereEach por before para que se ejecute una vez en todo el test y no por cada test (prueba).
  // Es costoso arrancar y apagar el servidor
  // Recuerda que devuelve una promesa cuando el servidor esté listo
  before(async () => {
    instance = await server.start();
  });

  // Al terminar lo cerramos. Cambio afterEach por after
  after(() => {
    instance.close();
  });

  /**
   * TEST POST Login como Usuario (admin)
   */
  describe('POST: Identificar como usuario (admin): ', () => {
    it('Debería autenticar a usuario', (done) => {
      const user = {
        email: 'admin@admin.com',
        password: 'admin',
      };
      chai.request(instance)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });


  /**
   * TEST: GET ALL
   */
  describe('GET: Obtener todos los ficheros: ', () => {
    // Listamos todas las notas
    it('Debería obtener todas los ficheros', (done) => {
      chai.request(instance)
        .get(`${Path}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /**
   * TEST POST Añadir Fichero
   */
  describe('POST: Añadir (subir) una Fichero: ', () => {
    // Añade una nota
    it('Debería añadir una fichero', (done) => {
      chai.request(instance)
        .post(`${Path}`)
        .set({ Authorization: `Bearer ${token}` })
        .attach('file', fs.readFileSync(`${__dirname}/test.png`), 'test.png')
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('url');
          res.body.should.have.property('metadata');
          idFichero = res.body.id;
          done();
        });
    });
  });
  /**
  * TEST DELETE Eliminar Fichero
  */
  // eslint-disable-next-line no-undef
  describe('DELETE: Eliminar Fichero: ', () => {
    // eslint-disable-next-line no-undef
    it('No Debería eliminar un fichero, le he pasado el id equivocado', (done) => {
      chai.request(instance)
        .delete(`${Path}/${idFichero}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    // No existe el fichero
    it('No debería eliminar una un fichero, no existe esta mal formado', (done) => {
      const id = 'patata';
      chai.request(instance)
        .delete(`${Path}/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });
  /**
   * TEST POST, Cierra la sesión del usuario
   * Debe ser el último test
   */
  describe('POST: Salir de sesión usuario: ', () => {
    it('Debería salir de la sesión', (done) => {
      chai.request(instance)
        .post('/api/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });
});
