const Sequelize = require('sequelize');
const db = require('../db');

const Author = db.define('author', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
  },
  isMaintainer: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isContact: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

});

const PackageAuthorships = db.define('packageAuthorships', {});

const Package = db.define('package', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  title: Sequelize.TEXT,
  version: Sequelize.STRING,
  license: Sequelize.STRING,
  depends: Sequelize.ARRAY(Sequelize.STRING),
  suggests: Sequelize.ARRAY(Sequelize.STRING),
  imports: Sequelize.ARRAY(Sequelize.STRING),
});

Author.belongsToMany(Package, {
  through: 'PackageAuthorships'
});

Package.belongsToMany(Author, {
  through: 'PackageAuthorships'
});


const syncDB = async () => {
  const syncedDB = await db.sync();
  return syncedDB;
};

module.exports = {
  syncDB,
  Package,
  Author,
  PackageAuthorships
}