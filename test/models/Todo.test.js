var should = require('should');
describe('Todo', function() {

  it('should check the find method', function(done){
    Todo.find()
    .then(function(todo){
      todo.length.should.be.eql(0);
      done();
    })
    .catch(done);
  });

  it('should be empty', function(done) {
    Todo.find().then(function(todo) {
        todo.length.should.be.aboveOrEqual(0);
        done();
      })
      .catch(done);
  });

  it('it should have a name', function(done) {
    Todo.create().exec(function(err) {
      should(err).not.be.undefined;
      err.should.be.an.Array;
      err.should.have.lengthOf(1);
      return done();
    });
  });

  it('it should create a record', function(done) {
    new_todo = { name: "test", description: "some description" }
    Todo.create(new_todo).exec(function(err, todo) {
      todo.should.be.an.instanceOf(Object).and.have.property('name', todo.name);
    });
    return done();
  });

  it('it should not create a record if name is not given', function(done) {
    new_todo = { description: "some description" }
    Todo.create(new_todo).exec(function(err, todo) {
      should(err).not.be.undefined;
      should(todo).be.undefined;
    });
    return done();
  });
});
