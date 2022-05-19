import {Reducer} from 'redux';
import {appActions, appActionTypes} from '../actions/appActions';

export interface AppState {
}

const initialState: AppState = {};

const AppReducer: Reducer<AppState, appActions> = (state = initialState, action: appActions) => {
  switch (action.type) {
    case appActionTypes.APP_INIT: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
};
export default AppReducer;
