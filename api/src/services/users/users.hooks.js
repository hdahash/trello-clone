const {
  authenticate
} = require('@feathersjs/authentication').hooks;

const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;
const errors = require('@feathersjs/errors');

function beforecreate() {
  return function (context) {
    context.data.displayname = context.data.email.substring(0, context.data.email.indexOf('@'));
    if (context.data.password.length < 8) {
      context.statusCode = 400;
      context.errors = context.errors + '{"Password":{"message": "Error in Password."}}';
      //return context;

      throw new errors.BadRequest('Password must be longer than 8 characters', {
        password: context.data.password
      }); //new errors.Error('Password must be longer than 8 characters');
    }
  };
}
module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [beforecreate(), hashPassword()],
    update: [hashPassword(), authenticate('jwt')],
    patch: [hashPassword(), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [ /*console.log("after Create")*/ ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
