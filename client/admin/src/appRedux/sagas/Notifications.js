import {
  all, call, fork, put, takeEvery,
} from 'redux-saga/effects';
import { GET_NOTIFICATION, GET_All_NOTIFICATION } from 'constants/ActionTypes';
import axios from 'axios';
import { setNotifications, getAllNotifications, setAllNotifications } from '../actions/Notifications';

const NotificationsAPI = async () => await axios
  .get('/api/v2/notification/getNotifications', { withCredentials: true })
  .then(NotificationsResult => NotificationsResult)
  .catch(error => error);

function* notificationsWorker() {
  const NotificationsResult = yield call(NotificationsAPI);
  if (NotificationsResult.status === 200) {
    const { data } = NotificationsResult;
    let unRead = 0;
    data.map((notification) => {
      if (!notification.seen) unRead += 1;
    });
    yield put(setNotifications(unRead));
  }
}

function* getAllWorker() {
  const NotificationsResult = yield call(NotificationsAPI);
  if (NotificationsResult.status === 200) {
    const { data } = NotificationsResult;
    yield put(setAllNotifications(data));
  }
}
export function* getNotifications() {
  yield takeEvery(GET_NOTIFICATION, notificationsWorker);
}

export function* getAll() {
  yield takeEvery(GET_All_NOTIFICATION, getAllWorker);
}
export default function* rootSaga() {
  yield all([fork(getNotifications), fork(getAll)]);
}
