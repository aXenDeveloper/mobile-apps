import auth from './auth';
import user from './user';
import editor from './editor';
import site from './site';
import forums from './forums';
import { combineReducers } from 'redux';

export default combineReducers({ auth, user, editor, site, forums });