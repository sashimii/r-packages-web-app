const { Package, Author } = require('../model/');

const getAuthors = (packages) => {

  const authors = [];
  packages.forEach((package) => {
    package.authors.forEach((author) => {
      authors.push(author);
    })
  });

  return authors;

}

const saveAllPackageDescriptions = async (packages) => {
 
}



module.exports = {
  saveAllPackageDescriptions
}