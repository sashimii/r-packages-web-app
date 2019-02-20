require('dotenv').config();

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const redisClient = require('./redis');
const session = require('express-session');
const SessionStore = require('connect-redis')(session);

const bodyParser = require('body-parser');

const uuid = require('uuid/v4');

const { createMockData } = require('./model/mockdata');
const { getEventByUrl } = require('./services/events');

const {
  getTotalTicketsReserved,
  reserveForSession,
  removeReservedTickets
} = require('./services/ticketCache');

const FIFTEEN_MINUTES = 900000;

const checkoutSession = session({
  store: new SessionStore({
    client: redisClient,
  }),
  genid: (req) => {
    return uuid();
  },
  secret: process.env.COOKIE_SECRET,
  cookie: {
    secure: 'auto',
    maxAge: FIFTEEN_MINUTES,
  },
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/api/events/:eventUrl', async (req, res) => {
  try {
    const url = req.params.eventUrl;
    const eventInfo = await getEventByUrl(url);
    const eventWithUpdatedTickets = await removeReservedTickets(eventInfo);
    res.status(200).send(eventWithUpdatedTickets);
  } catch (e) {
    console.error(e);
    res.sendStatus(404);
  }
});


app.get('/redis', function (req, res) {
  // const jobs = [];
  redisClient.keys('*', function (err, keys) {
      if (err) return console.log(err);
      if(keys){
        console.log(keys);
        redisClient.get(keys[0], (err, val) => {
          res.send({
            key: keys[0],
            val
          });
        });
      }
  });
});


app.get('/api/clear-cache', async (req, res) => {
  await redisClient.keys('*', async (err, keys) => {
    if (err) return console.log(err);
    await keys.forEach(async (key) => {
      await redisClient.delAsync(key);
    });
  });
  res.send('Shit deleted yo');
});


app.get('/api/checkout', checkoutSession, async (req, res) => {
  res.send({ session: req.session, id: req.sessionID });
});


app.post('/api/checkout', checkoutSession, async (req, res) => {
  try {
    await reserveForSession(req.sessionID, req.body.event, req.body.tickets);
    // const newSessionInfo = JSON.parse(await redisClient.getAsync(sessionKey));
    const _reservedTickets = Object.keys(req.body.tickets).map(async (ticket) => {
      return { [ticket]: await getTotalTicketsReserved(req.body.event, ticket) }
    })
    const reservedTickets = await Promise.all(_reservedTickets); 
    console.log( reservedTickets );
    res.send({reservedTickets});
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});


app.post('/api/checkout/purchase', checkoutSession, async (req, res) => {
  try {
    
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

const bootServer = async () => {
  
  await createMockData();
  
  server.listen(3000, () => {
    console.log('App Listening on Port 3000')
  });
};

bootServer();