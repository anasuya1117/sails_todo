var supertest = require('supertest');
var assert = require('assert');

var createdtodo;
require('../bootstrap.test');

describe('Todo Controller', function() {

  it('get /todo', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    agent
      .get('/todo')
      .send()
      .expect(200)
      .end(function(err, result) {
        if (err) {
          done(err);
        } else {
          result.body.length.should.be.aboveOrEqual(0);
          done();
        }
      });
  });

  it('get /todo/:id not found', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/' + 1234;
    agent
      .get(todoUrl)
      .send()
      .expect(404, done);
  });

  it('get /todo/:id bad request', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/test';
    agent
      .get(todoUrl)
      .send()
      .expect(400, done);
  });

  it('post /todo', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todo = {
      "title": "Volkswagen Tiguan",
      "description": "This is a dummy text",
      "isCompleted": false
    };
    agent
    .post('/todo')
    .send(todo)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        done(err);
      } else {
        createdtodo = res.body;
        assert.equal(createdtodo.title, 'Volkswagen Tiguan');
        done();
      }
    });
  });

  it('post /todo error', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    
    var todo = {
      "description": "This is a dummy text",
      "isCompleted": false
    };
    agent
      .post('/todo')
      .send(todo)
      .expect(400, done);
  });

  it('get /todo/:id after todo creation', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/' + createdtodo.id;
    agent
      .get(todoUrl)
      .send()
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(createdtodo.title, 'Volkswagen Tiguan');
          done();
        }
      });
  });

  it('put /todo/:id', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/' + createdtodo.id;
    agent
      .put(todoUrl)
      .send({
        title: 'Tata Nexon New'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.body[0].title, 'Tata Nexon New');
          done();
        }
      });
  });

  it('put /todo/:id bad request', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/test';
    agent
      .put(todoUrl)
      .send({
        name: 'Tata Nexon New'
      })
      .expect(400, done);
  });

  it('put /todo/:id not found', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/' + 12345;
    agent
      .put(todoUrl)
      .send({
        name: 'Tata Nexon New'
      })
      .expect(404, done);
  });

  it('delete /todo/:id', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/' + createdtodo.id;
    agent
      .delete(todoUrl)
      .send()
      .expect(200, done);
  });

  it('delete /todo/:id bad request', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/test';
    agent
      .delete(todoUrl)
      .send()
      .expect(400, done);
  });

  it('delete /todo/:id not found', function(done) {
    var agent = supertest.agent(sails.hooks.http.app);
    var todoUrl = '/todo/' + 12345;
    agent
      .delete(todoUrl)
      .send()
      .expect(404, done);
  });

});
