import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Form,
  Icon,
  Input,
  message,
  notification,
} from 'antd';
import 'assets/vendors/style';
import 'styles/wieldy.less';
import configureStore, { history } from './appRedux/store';
import App from './containers/App';

export const store = configureStore();

class NextApp extends React.Component {
  state = {};

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/admin" component={App} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default NextApp;
