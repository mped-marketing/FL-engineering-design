import {
  SET_NOTIFICATION, SET_ALL_NOTIFICATIONS,
} from '../../constants/ActionTypes';

const INIT_STATE = {
  notificationsNumber: '',
  allNotifications: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_NOTIFICATION: {
      return {
        ...state,
        notificationsNumber: action.payload,
      };
    }
    case SET_ALL_NOTIFICATIONS: {
      return {
        ...state,
        allNotifications: action.payload,
      };
    }
    default:
      return state;
  }
};
