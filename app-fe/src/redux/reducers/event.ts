import { actionTypes } from '../actions/actionTypes';

export const currentEvent = (state = {}, { type, currentEvent }) => {

  switch (type) {
    case actionTypes.UPDATE_CURRENT_EVENT_VIEW:
      return Object.assign({}, currentEvent);
    default:
      return state;
  }

};