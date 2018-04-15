import auth from './auth';
import user from './user';
import { combineReducers } from 'redux';

export default combineReducers({ auth, user });