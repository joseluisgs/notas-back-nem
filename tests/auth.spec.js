/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// Librerías
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src';

process.env.NODE_ENV = 'test';

// Configuramos chai
const { assert } = chai;
const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

// Variables globales para todas las pruebas
const Path = '/api/auth';
let token;

/**
 * TEST: User
 */
describe('Batería de tests de Auth', () => {
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
   * TEST POST Login correcto
   */
  describe('POST: Identificar un usuario correcto: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería autenticar al usuario', (done) => {
      const user = {
        email: 'pepe@pepe.com',
        password: 'pepe',
      };
      chai.request(instance)
        .post(`${Path}/login`)
        .send(user)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });
  // Usuario incorrecto
  it('No debería autenticar al usuario, email incorrecto', (done) => {
    const user = {
      email: 'pepetest@pepetest.com',
      password: 'pepe',
    };
    chai.request(instance)
      .post(`${Path}/login`)
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        expect(res).to.have.status(401);
        done();
      });
  });
  it('No debería autenticar al usuario, password incorrecto', (done) => {
    const user = {
      email: 'pepe@pepe.com',
      password: 'pepetest',
    };
    chai.request(instance)
      .post(`${Path}/login`)
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        expect(res).to.have.status(401);
        done();
      });
  });
  /**
   * TEST POST, Cierra la sesión del usuario
   * Debe ser el último test
   */
  describe('POST: Salir de sesión usuario: ', () => {
    it('Debería salir de la sesión', (done) => {
      chai.request(instance)
        .post(`${Path}/logout`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });
  // Auth
});
