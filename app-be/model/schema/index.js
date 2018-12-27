const { Schema } = require('mongoose');

/**
 * Schemas only define what's required by user stories
 */

/**
 * Author
 */
const AuthorSchema = new Schema({
  name: {
    type: String,
    unique: true, // Assuming there aren't more than one Bob Smiths in academia 
  },
  email: {
    type: String,
    unique: true, 
  },
  isMaintainer: {
    type: Boolean,
    default: false,
  },
  isContact: {
    type: Boolean,
    default: false,
  },
  packagesAuthored: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    }
  ]
});


/**
 * Package
 * 
 * Ideally, dependencies would refer to other packages
 * if all of the packages were indexed for future reference,
 * but currently we're working with the idea that this solution 
 * works with at least 500 packages so an array of strings
 * will have to do.
 */

const PackageSchema = new Schema({
  package: {
    type: String,
    unique: true,
  },
  title: String,
  version: String,
  authors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Author'
    }
  ],
  license: String,
  depends: [String],
  suggests: [String],
  imports: [String]
});


module.exports = {
  PackageSchema,
  AuthorSchema
}