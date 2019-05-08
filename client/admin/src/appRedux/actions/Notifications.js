import {
  SET_NOTIFICATION, GET_NOTIFICATION, GET_All_NOTIFICATION, SET_ALL_NOTIFICATIONS,
} from 'constants/ActionTypes';

export const setNotifications = notificationsNumber => ({
  type: SET_NOTIFICATION,
  payload: notificationsNumber,
});
export const setAllNotifications = notifications => ({
  type: SET_ALL_NOTIFICATIONS,
  payload: notifications,
});
export const getNotifications = () => ({
  type: GET_NOTIFICATION,
});

export const getAllNotifications = () => ({
  type: GET_All_NOTIFICATION,
});
