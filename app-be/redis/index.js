const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis);

const client = redis.createClient({
  url: process.env.REDIS_URI
});

module.exports = client;