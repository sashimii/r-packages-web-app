const { Event, EventTicketType, syncDB } = require('./schema/');

const createMockData = async () => {

  try {

    await syncDB()

    const reactMeetup = await Event.create({
      url: 'reactjs-meetup',
      name: 'ReactJS Meetup',
      bannerImageUrl: 'https://cdn-images-1.medium.com/max/1200/1*y6C4nSvy2Woe0m7bWEn4BA.png',
      location: 'Toronto, ON',
      description: `Come join us for an evening about the latest and greatest in React. We're giong to discuss Hooks and Stateless Components.`,
    });
  
    const freeTicket = await EventTicketType.create({
      name: 'Free Ticket',
      price: 0,
      quantityAvailable: 50,
    });
  
    const mealTicket = await EventTicketType.create({
      name: 'Meal Ticket',
      price: 7.00,
      quantityAvailable: 35,
    });
  
    await reactMeetup.setEventTicketTypes([freeTicket, mealTicket]);
    
  
    const footballMatch = await Event.create({
      url: 'arsenal-vs-chelsea',
      name: 'Arsenal vs Chelsea',
      bannerImageUrl: 'https://e2.365dm.com/18/08/768x432/skysports-graphic-data-premier-league_4390874.jpg',
      location: 'Chelsea, London',
      description: `It's going to be a fun match! Be there or be square!`
    });
  
    const regTicket = await EventTicketType.create({
      name: 'Regular Ticket',
      price: 35.95,
      quantityAvailable: 200,
    });
  
    const premiumTicket = await EventTicketType.create({
      name: 'Premium Ticket',
      price: 79.95,
      quantityAvailable: 50,
    });
  
    await footballMatch.setEventTicketTypes([regTicket, premiumTicket]);

    return; 

  } catch (e) {
    return e;
  }
  
  
}

module.exports = {
  createMockData
};