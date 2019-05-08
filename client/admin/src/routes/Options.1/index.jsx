import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';


const Table = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/options/main`} />
    <Route path={`${match.url}/main`} component={asyncComponent(() => import('./Logo'))} />
    <Route path={`${match.url}/social`} component={asyncComponent(() => import('./Social'))} />
    <Route path={`${match.url}/footer`} component={asyncComponent(() => import('./Footer'))} />
    <Route path={`${match.url}/contact`} component={asyncComponent(() => import('./Contact'))} />
    <Route path={`${match.url}/icon`} component={asyncComponent(() => import('./Icon'))} />
    <Route path={`${match.url}/map`} component={asyncComponent(() => import('./Map'))} />
  </Switch>
);

export default Table;
