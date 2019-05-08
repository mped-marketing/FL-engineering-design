import { all } from 'redux-saga/effects';
import authSagas from './Auth';
import notificationsSage from './Notifications';
import opationsSage from './opations';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    notificationsSage(),
    opationsSage(),
  ]);
}
