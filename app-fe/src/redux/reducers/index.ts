import { combineReducers } from 'redux';

import { currentAuthor } from './authors';
import { currentPackage, packageList } from './package';

// import { GlobalState } from '../types/GlobalState';

export default combineReducers<any>({
  packageList,
  currentAuthor,
  currentPackage,
});