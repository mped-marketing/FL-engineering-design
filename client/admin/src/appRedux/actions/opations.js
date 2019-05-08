import {
  SET_OPATIONS, GET_OPATIONS,
} from 'constants/ActionTypes';

export const setOpations = opations => ({
  type: SET_OPATIONS,
  payload: opations,
});

export const getOpations = () => ({
  type: GET_OPATIONS,
});
