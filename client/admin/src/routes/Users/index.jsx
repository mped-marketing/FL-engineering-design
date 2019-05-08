import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';


const Table = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/users/view`} />
    <Route path={`${match.url}/view`} component={asyncComponent(() => import('./ViewUsers'))} />
    <Route path={`${match.url}/adduser`} component={asyncComponent(() => import('./AddUser'))} />
    <Route path={`${match.url}/:id`} component={asyncComponent(() => import('./EditUser'))} />
  </Switch>
);

export default Table;
