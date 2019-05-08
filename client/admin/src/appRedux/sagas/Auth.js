import {
  all, call, fork, put, takeEvery,
} from 'redux-saga/effects';
import {
  SIGNIN_USER,
  SIGNOUT_USER,
} from 'constants/ActionTypes';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  showAuthMessage, userSignInSuccess, setUserRole, userSignOutSuccess,
} from '../actions/Auth';
import { getNotifications } from '../actions/Notifications';

const signOutRequest = async () => await axios('/api/v2/logout')
  .then(authUser => authUser)
  .catch(error => error);


function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser.status === 200) {
      yield put(userSignOutSuccess(signOutUser));
      localStorage.removeItem('user_id');
      Cookies.remove('jwt');
      Cookies.remove('io');
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

// /////////////////////////LOGON ///////////////////////

const loginAPI = async payload => await axios.post('/api/v2/login', payload)
  .then(authUser => authUser)
  .catch(error => error);

function* signInWorker({ payload }) {
  try {
    const signInUser = yield call(loginAPI, payload);
    if (signInUser.status === 200) {
      const { id, rule, resultCookie } = signInUser.data;
      yield put(userSignInSuccess(resultCookie));
      yield put(setUserRole(rule));
      yield put(getNotifications());
    } else {
      const { data } = signInUser.response;
      yield put(showAuthMessage(data));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInWorker);
}
// ////////////////LOGON ///////////////////////

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}
export default function* rootSaga() {
  yield all([fork(signInUser),
    fork(signOutUser)]);
}
