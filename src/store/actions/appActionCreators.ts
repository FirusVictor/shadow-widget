import { Dispatch } from 'redux';
import {
  appActionTypes, appInitAction,
} from './appActions';

export const appInit = (config) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: appActionTypes.APP_INIT,
      config,
    } as appInitAction);
  };
};

