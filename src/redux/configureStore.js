import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger();
const store = null;

export default function configureStore(preloadedState) {	
	if( !store ){
		store = createStore(
			rootReducer,
			preloadedState,
			applyMiddleware(
				thunkMiddleware,
				//loggerMiddleware
			)
		)
	}

	return store;
}