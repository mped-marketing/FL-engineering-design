import { SET_INSTALL } from '../../constants/ActionTypes';

export const setInstall = values => ({
  type: SET_INSTALL,
  payload: values,
});
