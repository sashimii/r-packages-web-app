import { actionTypes } from '../actions/actionTypes';

export const currentAuthor = (state = {}, { type, currentAuthor }) => {
  switch (type) {
    case actionTypes.UPDATE_CURRENT_AUTHOR_VIEW:
      return Object.assign({}, currentAuthor);
    default:
      return state;
  }
};