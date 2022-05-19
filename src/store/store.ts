// create redux store
import {applyMiddleware, combineReducers, createStore} from "redux";
import AppReducer from "./reducers/appReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  appReducer: AppReducer,
});

const store = createStore(rootReducer, undefined, composeWithDevTools(applyMiddleware(thunk)))
export default store;
