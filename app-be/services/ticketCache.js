const redisClient = require('../redis');

const addToTotalReserved = async (event, ticket, quantity = 0) => {
  const eventKey = `reserved:${event}:${ticket}`;
  let totalReserved = parseInt(await redisClient.getAsync(eventKey));
  if (isNaN(totalReserved)) {
    totalReserved = quantity;
  } else {
    totalReserved = totalReserved + quantity;
  }
  await redisClient.setAsync(eventKey, totalReserved);
}

const subtractFromTotalReserved = async (event, ticket, quantity = 0) => {
  const eventKey = `reserved:${event}:${ticket}`;
  let totalReserved = parseInt(await redisClient.getAsync(eventKey));
  if (isNaN(totalReserved)) {
    totalReserved = quantity;
  } else {
    totalReserved = totalReserved - quantity;
  }
  await redisClient.setAsync(eventKey, totalReserved);
}

const getTotalTicketsReserved = async (event, ticket) => {
  const eventKey = `reserved:${event}:${ticket}`;
  const totalReserved = parseInt(await redisClient.getAsync(eventKey));
  return isNaN(totalReserved) ? 0 : totalReserved;
}


const reserveForSession = async (sessionID, event, tickets) => {
  
  const reservationKey = `reservation:${sessionID}:${event}`;
  const reservationInfoCache = await redisClient.getAsync(reservationKey);
  
  let reservationInfo = JSON.parse(reservationInfoCache);

  // Remove Prior reserved amount 
  if (reservationInfoCache !== null) {
    const reservedTickets = reservationInfo[event];
    const removeOldTicketsPromise = Object.keys(reservedTickets).map(async (ticket) => {
      await subtractFromTotalReserved(event, ticket, reservedTickets[ticket]);
    });
    await Promise.all(removeOldTicketsPromise);
  }

  // Add Updated reserved amount
  reservationInfo = { [event] : { ...tickets } };

  const addNewTicketsPromise = Object.keys(tickets).map(async (ticket) => {
    await addToTotalReserved(event, ticket, tickets[ticket]);
  });

  await Promise.all(addNewTicketsPromise);

  await redisClient.setAsync(reservationKey, JSON.stringify(reservationInfo))

};


const removeReservedTickets = async (eventInfo) => {
  let reservedTickets = eventInfo.eventTicketTypes.map(async (ticket) => {
    return await getTotalTicketsReserved(eventInfo.url, ticket.name);
  });
  reservedTickets = await Promise.all(reservedTickets);

  eventInfo.eventTicketTypes = eventInfo.eventTicketTypes.map((ticket, index) => {
    const { quantityAvailable } = ticket;
    const quantityDifference = quantityAvailable - reservedTickets[index];
    ticket.quantityAvailable = quantityDifference <= 0 ? 0 : quantityDifference;
    return ticket;
  });

  return eventInfo;
}



module.exports = {
  subtractFromTotalReserved,
  addToTotalReserved,
  getTotalTicketsReserved,
  reserveForSession,
  removeReservedTickets
}
