import positionReducer from './positionReducer';
import sunReducer from './sunReducer';
import cityReducer from './cityReducer';
import {combineReducers} from 'redux';

const reducers = combineReducers({
    positionReducer,
    sunReducer,
    cityReducer,
})

export default reducers