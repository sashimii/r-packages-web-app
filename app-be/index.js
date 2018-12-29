const express = require('express');
const { getAuthorInfo } = require('./services/authors');
const { getPackageById, getPackagesByPage } = require('./services/packages');
const app = express();

const { populateDatabase } = require('./services/populate');
const { getUniqueAuthorsList } = require('./utils');
const packages = require('./crawler/package_descriptions.json');
const authors = getUniqueAuthorsList(packages);


/**
 * 
 * Short Cut
 * 
 * Ideally the front end for a simple SPA would be served via a `/static` folder
 * but there wasn't any time to implement a Webpack build script for the front end,
 * and for now this solution requires the app served on localhost:8080 to retrieve
 * data from localhost:3000 
 * 
 */

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/**
 * 
 * Short Cut
 * 
 * For simplicity of implementation, I'm using
 * author id & package id as the query parameters.
 * 
 * Ideally, you would want to search by name for more
 * RESTful URLs.
 * 
 */

// List of All Packages
app.get('/api/packages/', async (req, res) => {
  // Pagination
  const page = req.query.page;
  const limit = req.query.limit;
  if (page && limit) {
    try {
      const data = await getPackagesByPage(limit, page);
      res.status(200).json(data);
    } catch (e) {
      res.sendStatus(404);
    }    
  }
});

// Get Single Package
app.get('/api/package/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const packageInfo = await getPackageById(id);
    res.status(200).send(packageInfo);
  } catch (e) {
    res.sendStatus(404);
  }
});

// Get Author Information
app.get('/api/author/:id',  async (req, res) => {
  try {
    const id = req.params.id;
    const authorInfo = await getAuthorInfo(id);
    res.status(200).send(authorInfo);
  } catch (e) {
    res.sendStatus(404);
  }
  
});


/**
 * Short Cut to save on time: 
 * 
 * This is not ideal, but including `Sequelize.close()`
 * in `./models/populate.js` attempts to close a connection to the
 * database while it's querying, and `finally {}` or `.finally()`
 * do not wait for async calls in either the `then`able or `try {}`
 * block.
 *  
 * So, the shortcut is to populate the database on server startup.
 * Running `npm run server` should crawl for the latest CRAN data,
 * and populate the database accordingly anyway.
 * 
 * `app.listen` is then called inside of populateDatabase's then
 * statement, assuming the data migration is successful.
 * 
 */


populateDatabase(packages, authors)
  .then(() => {
    app.listen(3000, () => {
      console.log('App Listening on Port 3000')
    });
  });
