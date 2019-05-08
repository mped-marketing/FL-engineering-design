import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';


const Table = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/about/edit`} />
    <Route path={`${match.url}/edit`} component={asyncComponent(() => import('./Edit'))} />
    <Route path={`${match.url}/items/:id`} component={asyncComponent(() => import('./Items/Edit'))} />
    <Route path={`${match.url}/items`} component={asyncComponent(() => import('./Items/index'))} />
  </Switch>
);

export default Table;
