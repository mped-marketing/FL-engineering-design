import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import {
  HIDE_MESSAGE,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  INIT_URL,
  SET_USER_ROLE,
} from '../../constants/ActionTypes';

const cookie = Cookies.get('jwt');
let role;
if (cookie) {
  try {
    const jwt = jwtDecode(cookie);

    role = jwt.rule;
  } catch (error) {
    role = null;
  }
} else {
  role = null;
}
const INIT_STATE = {
  loader: false,
  alertMessage: '',
  showMessage: false,
  url: '',
  authUser: Cookies.get('jwt'),
  role,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SIGNIN_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case SET_USER_ROLE: {
      return {
        ...state,
        role: action.payload,
      };
    }
    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        authUser: null,
        socket: null,
      };
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false,
      };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false,
        loader: false,
      };
    }
    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true,
      };
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false,
      };
    }
    case INIT_URL: {
      return {
        ...state,
        url: action.payload,
      };
    }
    default:
      return state;
  }
};
