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
let idNota;

/**
 * TEST: Notas
 */
describe('Batería de tests de Notas', () => {
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
   * TEST: GET ALL
   */
  describe('GET: Obtener todas las Notas: ', () => {
    // Listamos todas las notas
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
   * TEST POST Añadir Nota
   */
  describe('POST: Añadir una Nota: ', () => {
    // Añade una nota
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

    // Si le falta el campo obligatorio
    it('No Debería añadir una Nota pues falta el título', (done) => {
      const nota = {
        // titulo: 'Nota de test',
        descripcion: 'Esto es una prueba de test',
        usuarioId: '1234',
      };
      chai.request(instance)
        .post('/api/notas')
        .send(nota)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  /**
  * TEST: GET BY ID
  */
  describe('GET: Obtiene una nota por id', () => {
    // Caso con un id que existe
    it('Debería obtener una nota dado su id', (done) => {
      chai.request(instance)
        .get(`/api/notas/${idNota}`)
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
          res.body.should.have.property('_id').eql(idNota);
          done();
        });
    });

    // Caso con un id que no existe
    it('Debería fallar porque no existe una nota con este id', (done) => {
      const id = '5eda22b4e921322a1570a7f9';
      chai.request(instance)
        .get(`/api/notas/${id}`)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(404);
          done();
        });
    });

    // Caso con id mal formado
    it('Debería fallar porque el id es mal formado', (done) => {
      const id = 'patata';
      chai.request(instance)
        .get(`/api/notas/${id}`)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(500);
          done();
        });
    });
  });


  /**
   * TEST PUT Modificar Nota
   */
  describe('PUT: Modificar Nota: ', () => {
    // Actualiza la nota
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

    // No existe el id
    it('No debería modificar una Nota, no existe el id', (done) => {
      const id = '5eda22b4e921322a1570a7f9';
      const nota = {
        titulo: 'Nota de test mod',
        descripcion: 'Esto es una prueba de test mod',
        usuarioId: '1234',
      };
      chai.request(instance)
        .put(`/api/notas/${id}`)
        .send(nota)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });

    // ID mal formado
    it('No debería modificar una Nota, no existe esta mal formado', (done) => {
      const id = 'patata';
      const nota = {
        titulo: 'Nota de test mod',
        descripcion: 'Esto es una prueba de test mod',
        usuarioId: '1234',
      };
      chai.request(instance)
        .put(`/api/notas/${id}`)
        .send(nota)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  /**
   * TEST DELETE Eliminar Nota
   */
  describe('DELETE: Eliminar una Nota: ', () => {
    // Eliminar la nota
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

    // No existe el id
    it('No debería eliminar una Nota, no existe el id', (done) => {
      const id = '5eda22b4e921322a1570a7f9';
      chai.request(instance)
        .delete(`/api/notas/${idNota}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });

    // ID mal formado
    it('No debería eliminar una Nota, no existe esta mal formado', (done) => {
      const id = 'patata';
      chai.request(instance)
        .delete(`/api/notas/${idNota}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
// Notas
});
