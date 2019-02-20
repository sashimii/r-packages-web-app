const Sequelize = require('sequelize');
const db = require('../db');


const Event = db.define('event', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bannerImageUrl: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  location: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  }
});


const EventTicketType = db.define('eventTicketType', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL,
  },
  quantityAvailable: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

Event.hasMany(EventTicketType);
EventTicketType.belongsTo(Event);

const EventGuest = db.define('eventGuest', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isNumeric: true
    } 
  },
});

Event.hasMany(EventGuest);
EventGuest.belongsTo(Event);



// const Author = db.define('author', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//   },
//   isMaintainer: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: false,
//   },
//   isContact: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: false,
//   },

// });

// const PackageAuthorships = db.define('packageAuthorships', {});

// const Package = db.define('package', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     unique: true,
//   },
//   title: Sequelize.TEXT,
//   version: Sequelize.STRING,
//   license: Sequelize.STRING,
//   depends: Sequelize.ARRAY(Sequelize.STRING),
//   suggests: Sequelize.ARRAY(Sequelize.STRING),
//   imports: Sequelize.ARRAY(Sequelize.STRING),
// });

// Author.belongsToMany(Package, {
//   through: 'PackageAuthorships'
// });

// Package.belongsToMany(Author, {
//   through: 'PackageAuthorships'
// });


const syncDB = async () => {
  const syncedDB = await db.sync();
  return syncedDB;
};

module.exports = {
  syncDB,
  Event,
  EventTicketType,
  EventGuest
}