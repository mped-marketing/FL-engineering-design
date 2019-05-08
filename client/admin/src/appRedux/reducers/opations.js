import {
  SET_OPATIONS,
} from '../../constants/ActionTypes';

const INIT_STATE = {
  opations: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_OPATIONS: {
      return {
        ...state,
        opations: action.payload,
      };
    }

    default:
      return state;
  }
};
