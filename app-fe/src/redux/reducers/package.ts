import { actionTypes } from '../actions/actionTypes';

export const packageList = (state = {}, { type, update }) => {

  switch (type) {
    case actionTypes.UPDATE_PACKAGE_LIST:
      return Object.assign({}, state, update);
    default:
      return state;
  }

};

export const currentPackage = (state = {}, { type, currentPackage }) => {
  switch (type) {
    case actionTypes.UPDATE_CURRENT_PACKAGE_VIEW:
      return Object.assign({}, currentPackage);
    default:
      return state;
  }
};