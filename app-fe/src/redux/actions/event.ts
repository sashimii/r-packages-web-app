import Axios from 'axios';
import { API_SERVER_HOSTNAME } from '../../config';
import { actionTypes } from './actionTypes';

const updateCurrentEventView = eventToRender => {
  return {
    type: actionTypes.UPDATE_CURRENT_EVENT_VIEW,
    currentEvent: eventToRender,
  };
};

export const fetchEvent = id => dispatch => {
  return Axios.get(`${API_SERVER_HOSTNAME}/api/events/${id}`)
              .then(res => {
                dispatch({ type: actionTypes.FETCH_CURRENT_EVENT_SUCCESS });
                console.log(res.data); // tslint:disable
                dispatch(updateCurrentEventView(res.data));
              })
              .catch(e => {
                dispatch({type: actionTypes.FETCH_CURRENT_EVENT_FAILURE});
              });
};