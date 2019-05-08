import { SET_FORM } from '../../constants/ActionTypes';

export const setForm = values => ({
  type: SET_FORM,
  payload: values,
});
