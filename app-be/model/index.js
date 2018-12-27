const mongoose = require('mongoose');
const connect = require('./connect');

connect(process.env.MONGO_URI);

const { PackageSchema, AuthorSchema } = require('./schema');

const Package = mongoose.model('Package', PackageSchema);
const Author = mongoose.model('Author', AuthorSchema);

module.exports = { Package, Author };

