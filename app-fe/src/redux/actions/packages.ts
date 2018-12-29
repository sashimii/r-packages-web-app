import axios from 'axios';
import { API_SERVER_HOSTNAME, PAGE_RESULTS_LIMIT } from '../../config';
import { actionTypes } from './actionTypes';

// Fetch States for Package List

const updatePackagesList = packages => {
  return {
    type: actionTypes.UPDATE_PACKAGE_LIST,
    update: {
      count: packages.count,
      page: packages.page,
      pages: packages.pages,
      [packages.page]: packages.result,
    },
  };
};

const updateCurrentPackageView = packageToView => {
  return {
    type: actionTypes.UPDATE_CURRENT_PACKAGE_VIEW,
    currentPackage: packageToView,
  };
};

export const fetchPackagesPerPage = (page = 1) => dispatch => {
  dispatch({ type: actionTypes.FETCH_PACKAGE_LIST_REQUEST });
  return axios.get(`${API_SERVER_HOSTNAME}/api/packages/?limit=${PAGE_RESULTS_LIMIT}&page=${page}`)
              .then(res => {
                dispatch({ type: actionTypes.FETCH_PACKAGE_LIST_SUCCESS });
                dispatch(updatePackagesList(res.data));
              })
              .catch(e => {
                dispatch({ type: actionTypes.FETCH_PACKAGE_LIST_FAILURE });
              });
};

export const fetchPackage = id => dispatch => {
  dispatch({ type: actionTypes.FETCH_PACKAGE_REQUEST });
  return axios.get(`${API_SERVER_HOSTNAME}/api/package/${id}`)
              .then(res => {
                dispatch({ type: actionTypes.FETCH_PACKAGE_SUCCESS });
                dispatch(updateCurrentPackageView(res.data));
              })
              .catch(e => {
                dispatch({ type: actionTypes.FETCH_PACKAGE_FAILURE });
              });
};