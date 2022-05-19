export enum appActionTypes {
  APP_INIT,
}

export interface appInitAction {
  type: appActionTypes.APP_INIT,
}


export type appActions =
    appInitAction;
