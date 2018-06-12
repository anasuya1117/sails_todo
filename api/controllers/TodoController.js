/**
 * CarsController
 * @description :: Server-side logic for managing Carscontrollers
 */

module.exports = {

  fetch: function(req, res, next) {
    Todo.find()
    .exec(function(err, todo) {
      if (err) return next(err);
      return res.json(todo);
    });
  },

  create: function(req, res, next) {
    var params = {};
    params = _.merge({}, req.params.all(), req.body);
    Todo.create(params)
    .exec(function(err, todo) {
      if (err) return res.badRequest(err);
      sails.log('Todo with id '+ todo.id + ' created');
      return res.json(todo);
    });
  },

  findOne: function(req, res, next) {
    var id = parseInt(req.param('id'));
    if (!id) {
      return res.badRequest('Required param: id not provided.');
    }
    Todo.findOne({
      id: id
    })
    .exec(function(err, todo) {
      if (todo === undefined) return res.notFound({
        "error": "Todo not found."
      });
      if (err) return next(err);
      return res.json(todo);
    });
  },

  update: function(req, res, next) {
    var id = parseInt(req.param('id'));
    if (!id) {
      return res.badRequest('Required param: id not provided.');
    }
    var params = {};
    params = _.merge({}, req.params.all(), req.body);
    Todo.update(id, params, function(err, todo) {
      if (todo.length === 0) return res.notFound({
        "error": "Record not found."
      });
      if (err) return next(err);
      res.json(todo);
    });
  },

  delete: function(req, res, next) {
    var id = parseInt(req.param('id'));
    if (!id) {
      return res.badRequest({
        "error": "ID should be an integer and is required"
      });
    }
    Todo.findOne({
        id: id
      }).exec(function(err, result) {
      if (err) return res.serverError(err);
      if (!result) return res.notFound({
        "error": "Record not found."
      });
      Todo.destroy(id, function(err) {
        if (err) return next(err);
        return res.ok();
      });
    });
  },
};
