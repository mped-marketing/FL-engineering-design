import { SET_INSTALL } from '../../constants/ActionTypes';

const INIT_STATE = {
  values: { type: '1', layout: '1' },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_INSTALL: {
      return {
        values: { ...state.values, ...action.payload },
      };
    }
    default:
      return state;
  }
};
