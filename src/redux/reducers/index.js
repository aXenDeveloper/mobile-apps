import auth from './auth';
import user from './user';
import editor from './editor';
import { combineReducers } from 'redux';

export default combineReducers({ auth, user, editor });