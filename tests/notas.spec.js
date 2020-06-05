/* eslint-disable no-underscore-dangle */
// Librerías
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src';

process.env.NODE_ENV = 'test';

const { assert } = chai;
const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

// Variables globales para todas las pruebas
let idNota;

/**
 * TEST: Notas
 */
// eslint-disable-next-line no-undef
describe('Batería de tests de Notas', () => {
  let instance;

  // antes de comenzar, levantamos el servidor, cambo befereEach por before para que se ejecute una vez en todo el test y no por cada test (prueba).
  // Es costoso arrancar y apagar el servidor
  // eslint-disable-next-line no-undef
  before(() => {
    instance = server.start();
  });

  // Al terminar lo cerramos. Cambio afterEach por after
  // eslint-disable-next-line no-undef
  after(() => {
    instance.close();
  });


  /**
   * TEST: GET ALL
   */
  // eslint-disable-next-line no-undef
  describe('GET: Obtener todas las Notas: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener todas las notas', (done) => {
      chai.request(instance)
        .get('/api/notas')
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /**
  * TEST: GET BY ID
  */
  // eslint-disable-next-line no-undef
  describe('GET: Obtiene una nota por id', () => {
    // eslint-disable-next-line no-undef
    it('Debería obtener una nota dado su id', (done) => {
      const id = '5eda22b4e921322a1570a7f3';
      chai.request(instance)
        .get(`/api/notas/${id}`)
        // .send(recipe)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('titulo');
          res.body.should.have.property('descripcion');
          res.body.should.have.property('activo');
          res.body.should.have.property('usuarioId');
          res.body.should.have.property('fecha');
          res.body.should.have.property('fichero');
          res.body.should.have.property('_id').eql(id);
          done();
        });
    });
  });

  /**
   * TEST POST Añadir Nota
   */
  // eslint-disable-next-line no-undef
  describe('POST: Añadir una Nota: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería añadir una Nota', (done) => {
      const nota = {
        titulo: 'Nota de test',
        descripcion: 'Esto es una prueba de test',
        usuarioId: '1234',
      };
      chai.request(instance)
        .post('/api/notas')
        .send(nota)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('titulo');
          res.body.should.have.property('descripcion');
          res.body.should.have.property('activo');
          res.body.should.have.property('usuarioId');
          res.body.should.have.property('fecha');
          res.body.should.have.property('fichero');
          idNota = res.body._id;
          done();
        });
    });
  });

  /**
   * TEST PUT Modificar Nota
   */
  // eslint-disable-next-line no-undef
  describe('PUT: Modificar Nota: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería modificar una Nota', (done) => {
      const nota = {
        titulo: 'Nota de test mod',
        descripcion: 'Esto es una prueba de test mod',
        usuarioId: '1234',
      };
      chai.request(instance)
        .put(`/api/notas/${idNota}`)
        .send(nota)
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('titulo');
          res.body.should.have.property('descripcion');
          res.body.should.have.property('activo');
          res.body.should.have.property('usuarioId');
          res.body.should.have.property('fecha');
          res.body.should.have.property('fichero');
          res.body.should.have.property('_id').eql(idNota);
          done();
        });
    });
  });

  /**
   * TEST DELETE Eliminar Nota
   */
  // eslint-disable-next-line no-undef
  describe('DELETE: Eliminar una Nota: ', () => {
    // eslint-disable-next-line no-undef
    it('Debería eliminar una nota', (done) => {
      chai.request(instance)
        .delete(`/api/notas/${idNota}`)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('titulo');
          res.body.should.have.property('descripcion');
          res.body.should.have.property('activo');
          res.body.should.have.property('usuarioId');
          res.body.should.have.property('fecha');
          res.body.should.have.property('fichero');
          res.body.should.have.property('_id').eql(idNota);
          done();
        });
    });
  });
// Recetas
});
