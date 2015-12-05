const app     = require('../src/app').createApp();
const request = require('supertest');
const should  = require('chai').should();

describe('session', () => {
  it('login should create session', (done) => {
    request(app)
      .get('/api/login')
      .expect((res) => {
        res.headers['set-cookie'].should.match(/session=/);
      })
      .expect(302, done);
  })
})
