const { Event, EventTicketType } = require('../model/schema');
const redisClient = require('../redis');
const { getTotalTicketsReserved } = require('./ticketCache');

const getEventById = async (id) => {
  const eventInfo = await Event.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: EventTicketType
      }
    ]
  });
  return eventInfo.toJSON();
};

const getEventByUrl = async (url) => {
  let eventInfo = await Event.findOne({
    where: {
      url: url
    },
    include: [
      {
        model: EventTicketType
      }
    ]
  });

  eventInfo = eventInfo.toJSON();
  setCacheForEvent(eventInfo.url, eventInfo);

  return eventInfo;
};

const setCacheForEvent = async (url, eventInfo) => {
  const eventKey = `event:${url}`;
  await redisClient.setAsync(eventKey, JSON.stringify(eventInfo));
}

const getCacheForEvent = async (url) => {
  const eventKey = `event:${url}`;
  let eventInfo = await redisClient.getAsync(eventKey);
  eventInfo = JSON.parse(eventInfo);
  return eventInfo;
}

module.exports = {
  getEventById,
  getEventByUrl,
  getCacheForEvent
};

