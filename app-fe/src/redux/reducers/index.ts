import { combineReducers } from 'redux';

import { currentAuthor } from './authors';
import { currentPackage, packageList } from './package';

export default combineReducers<any>({
  packageList,
  currentAuthor,
  currentPackage,
});