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
const Path = '/api/users';
let idUser;

/**
 * TEST: User
 */
describe('Batería de tests de User', () => {
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
  describe('GET: Obtener todas los usuarios: ', () => {
    // Listamos todas los usuarios
    it('Debería obtener todos los usuarios', (done) => {
      chai.request(instance)
        .get(`${Path}`)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  /**
  * TEST POST Añadir un usuario
  */
  describe('POST: Añadir una Usuario: ', () => {
    // Añade un usuario
    it('Debería añadir una Usuario', (done) => {
      const user = {
        username: 'pruebatest',
        email: 'pruebatest@prueba.com',
        password: 'prueba',
        role: 'USER',
      };
      chai.request(instance)
        .post(`${Path}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('activo');
          res.body.should.have.property('role');
          res.body.should.have.property('avatar');
          idUser = res.body._id;
          done();
        });
    });

    // Si le falta el campo username
    it('No Debería añadir un Usuario pues falta el username', (done) => {
      const user = {
        email: 'prueba@prueba.com',
        password: 'prueba',
        role: 'USER',
      };
      chai.request(instance)
        .post(`${Path}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    // Si le falta el campo email
    it('No Debería añadir un Usuario pues falta el email', (done) => {
      const user = {
        username: 'test',
        password: 'prueba',
        role: 'USER',
      };
      chai.request(instance)
        .post(`${Path}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    // Si le falta el campo password
    it('No Debería añadir un Usuario pues falta el password', (done) => {
      const user = {
        username: 'test',
        email: 'test@prueba.com',
        role: 'USER',
      };
      chai.request(instance)
        .post(`${Path}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    // Si el rol no es de los admitidos
    it('No Debería añadir un Usuario pues rol es incorrecto', (done) => {
      const user = {
        username: 'test',
        email: 'test@prueba.com',
        password: 'prueba',
        role: 'PEPE',
      };
      chai.request(instance)
        .post(`${Path}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    // Violacvión de datos únicos
    it('No Debería añadir un Usuario usuario repetidos', (done) => {
      const user = {
        username: 'pruebatest',
        email: 'pruebatest@prueba.com',
        password: 'prueba',
        role: 'USER',
      };
      chai.request(instance)
        .post(`${Path}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    // Violacvión de datos únicos
    it('No Debería añadir un Usuario email repetidos', (done) => {
      const user = {
        username: 'pruebatest',
        email: 'pruebatest@prueba.com',
        password: 'prueba',
        role: 'USER',
      };
      chai.request(instance)
        .post(`${Path}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  /**
  * TEST: GET BY ID
  */
  describe('GET: Obtener Usuario por ID', () => {
    // Caso con un id que existe
    it('Debería obtener un usuario dado su id', (done) => {
      chai.request(instance)
        .get(`${Path}/${idUser}`)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('activo');
          res.body.should.have.property('role');
          res.body.should.have.property('avatar');
          res.body.should.have.property('_id').eql(idUser);
          done();
        });
    });

    // Caso con un id que no existe
    it('Debería fallar porque no existe un usuario con este id', (done) => {
      const id = '5eda22b4e921322a1570a7f9';
      chai.request(instance)
        .get(`${Path}/${id}`)
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
        .get(`${Path}/${id}`)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(500);
          done();
        });
    });
  });

  /**
   * TEST PUT Modificar
   */
  describe('PUT: Modificar Usuario: ', () => {
    // Actualiza un usuario
    it('Debería modificar unUsuario', (done) => {
      const user = {
        password: 'pruebatest',
        role: 'USER',
      };
      chai.request(instance)
        .put(`${Path}/${idUser}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('activo');
          res.body.should.have.property('role');
          res.body.should.have.property('avatar');
          res.body.should.have.property('_id').eql(idUser);
          done();
        });
    });

    // No existe el id
    it('No debería modificar un usuario, no existe el id', (done) => {
      const id = '5eda22b4e921322a1570a7f9';
      const user = {
        password: 'pruebatest',
        role: 'USER',
      };
      chai.request(instance)
        .put(`${Path}/${id}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });

    // ID mal formado
    it('No debería modificar un usuario, no existe esta mal formado', (done) => {
      const id = 'patata';
      const user = {
        password: 'pruebatest',
        role: 'USER',
      };
      chai.request(instance)
        .put(`${Path}/${id}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    // Rol incorrecto
    it('No debería modificar un usuario, no existe rol', (done) => {
      const id = 'patata';
      const user = {
        password: 'pruebatest',
        role: 'PEPE',
      };
      chai.request(instance)
        .put(`${Path}/${idUser}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });
  /**
   * TEST DELETE Eliminar Usuario
   */
  describe('DELETE: Eliminar Usuario: ', () => {
    // Eliminar usuario
    it('Debería eliminar una Usuario', (done) => {
      chai.request(instance)
        .delete(`${Path}/${idUser}`)
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('activo');
          res.body.should.have.property('role');
          res.body.should.have.property('avatar');
          res.body.should.have.property('_id').eql(idUser);
          done();
        });
    });

    // No existe el id
    it('No debería eliminar un usuario, no existe el id', (done) => {
      const id = '5eda22b4e921322a1570a7f9';
      chai.request(instance)
        .delete(`${Path}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });

    // ID mal formado
    it('No debería eliminar un usuario, no existe esta mal formado', (done) => {
      const id = 'patata';
      chai.request(instance)
        .delete(`${Path}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  // Users
});
