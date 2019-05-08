import { SET_FORM } from '../../constants/ActionTypes';

const INIT_STATE = {
  values: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_FORM: {
      return {
        values: { ...state.values, ...action.payload },
      };
    }
    default:
      return state;
  }
};
