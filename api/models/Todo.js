module.exports = {
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true
    },
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
    },
    done: {
      type: 'boolean',
      default: false
    }

  },
};
