import {
  all, call, fork, put, takeEvery,
} from 'redux-saga/effects';
import { SET_OPATIONS, GET_OPATIONS } from 'constants/ActionTypes';
import axios from 'axios';
import { setOpations, getOpations } from '../actions/opations';

const OpationsAPI = async () => await axios
  .get('/api/v2/getoptions')
  .then(OpationsResult => OpationsResult)
  .catch(error => error);

function* opationsWorker() {
  const OpationsResult = yield call(OpationsAPI);
  if (OpationsResult.status === 200) {
    const { data } = OpationsResult;
    yield put(setOpations(data));
  }
}

export function* getOpationsData() {
  yield takeEvery(GET_OPATIONS, opationsWorker);
}


export default function* rootSaga() {
  yield all([fork(getOpationsData)]);
}
