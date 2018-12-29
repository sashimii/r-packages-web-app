const Sequelize = require('sequelize');
const { syncDB, Package, Author } = require('../model/schema');
const db = require('../model/db');
const { getUniqueAuthorsList } = require('../utils');

const packages = require('../crawler/package_descriptions.json');
const authors = getUniqueAuthorsList(packages);
const Op = Sequelize.Op;

// Only To be used by crawler
const populateDatabase = async (rPackages, rAuthors) => {
  try {
    await syncDB();

    // Populating Authors Table
    try {
   
      console.log('*** Populating Authors Table');
   
      const createAuthorPromises = rAuthors.map(async (author) => {
        return await Author.create({
          name: author.name,
          email: author.email,
          isMaintainer: author.isMaintainer,
          isContact: author.isContact,
        })
      });
      await Promise.all(createAuthorPromises).catch(console.log);
    } catch (e) {
      console.error('Author Creation Error:', e);
    }
    
    // Populating Packages Table
    try {

      console.log('*** Populating Packages Table')
      
      const createPackagePromises = rPackages.map(async (package) => {
        return await Package.create({
          name: package.name,
          title: package.title,
          version: package.version,
          license: package.license,
          depends: package.depends,
          suggests: package.suggests,
          imports: package.imports,
        });
      });
      await Promise.all(createPackagePromises).catch(console.log);
    } catch (e) {
      console.error('Package Creation Error:', e);
    }

    try {  
      // Setting Many-to-Many Associations

      console.log('*** Setting Many-to-Many Associations between Authors & Packages')
      rPackages.forEach(async (package) => {

          const _package = await Package.findOne({
            where: {
              name: package.name
            }
          })
    
          const authorNames = package.authors.reduce((acc, {name}) => {
            return acc.add(name);
          }, new Set());
        
          const _authors = await Author.findAll({
            where: {
              name: {
                [Op.or] : [...authorNames]
              }
            } 
          })

          await _package.setAuthors(_authors).then().catch(console.log);
          _authors.forEach(async packageAuthor => {
            await packageAuthor.addPackage(_package).then().catch(console.log);
          });

      });
    } catch(e) {
      console.error('Author/Package Association Error:', e);
    }

  } catch (e) {
    console.error('Database Sync Error:', e);        
  } finally {
    return;
  }

}


module.exports = {
  populateDatabase,
}