import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { EventType } from '../interfaces/event';
import { fetchEvent } from '../redux/actions/event';

interface EventPropTypes {
  event: EventType;
  match: any;
  location: any;
  dispatch(): void;
}

class Event extends React.Component<EventPropTypes, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchEvent();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.eventName !== this.props.match.params.eventName) {
      this.fetchEvent();
    }
  }

  fetchEvent() {
    const { eventName } = this.props.match.params;
    fetchEvent(eventName)(this.props.dispatch);
  }

  render() {
    const {
      name,
      date,
      location,
      eventTicketTypes,
      description,
      bannerImageUrl } = this.props.event;

    const time = new Date(date).toLocaleDateString();

    return this.props.event && (
      <div>
        <div>
          <img src={bannerImageUrl} />
        </div>
        <h1>{ name }</h1>
        <p>{ time }</p>
        <p>{ location }</p>

        <h3>Tickets</h3>
        {
          eventTicketTypes &&
          eventTicketTypes.map(({ name, price, quantityAvailable }, index) => {
            return (
              <div key={`ticket-type-${index}`}>
                <span>{ name }</span>
                <span>{ price } </span>
                <span>{ quantityAvailable }</span>
              </div>
            );
          })
        }
        <hr />
        <h3>Description</h3>
        { description }
      </div>
    );
  }

}

const mapStateToProps = ({ currentEvent }) => {
  return {
    event: currentEvent,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Event) as any);