import Axios from 'axios';
import { API_SERVER_HOSTNAME } from '../../config';
import { actionTypes } from './actionTypes';

const updateCurrentAuthorView = authorToRender => {
  return {
    type: actionTypes.UPDATE_CURRENT_AUTHOR_VIEW,
    currentAuthor: authorToRender,
  };
};

export const fetchAuthor = id => dispatch => {
  dispatch({ type: actionTypes.FETCH_PACKAGE_LIST_REQUEST });
  return Axios.get(`${API_SERVER_HOSTNAME}/api/author/${id}`)
              .then(res => {
                dispatch({ type: actionTypes.FETCH_CURRENT_AUTHOR_SUCCESS });
                dispatch(updateCurrentAuthorView(res.data));
              })
              .catch(e => {
                dispatch({type: actionTypes.FETCH_CURRENT_AUTHOR_FAILURE});
              });
};