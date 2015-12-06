const app     = require('../src/app').createApp();
const request = require('supertest');
const should  = require('chai').should();

describe('session', () => {
  it('login should create session', (done) => {
    request(app)
      .post('/api/login')
      .send({username: 'Matti',
             password: 'salasana1'})
      .expect((res) => {
        res.headers['set-cookie'].should.match(/session=/);
      })
      .expect(201, done);
  })

  it('login should fail wih incorrect username/password', (done) => {
    request(app)
      .post('/api/login')
      .send({username: 'incorrect',
             password: 'incorrect'})
      .expect((res) => {
        res.headers.should.not.have.property('set-cookie');
      })
      .expect(401, done);
  })
})
