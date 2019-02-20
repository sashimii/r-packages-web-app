import { combineReducers } from 'redux';

import { currentAuthor } from './authors';
import { currentEvent } from './event';
import { currentPackage, packageList } from './package';

export default combineReducers<any>({
  packageList,
  currentAuthor,
  currentPackage,
  currentEvent,
});