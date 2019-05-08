import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';
import './style.css';


const Table = ({ match }) => (

  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/core/viewcore`} />
    <Route path={`${match.url}/viewcore`} component={asyncComponent(() => import('./ViewCore'))} />
    <Route path={`${match.url}/addcore`} component={asyncComponent(() => import('./AddCore'))} />
    <Route path={`${match.url}/:id`} component={asyncComponent(() => import('./EditCore'))} />
  </Switch>
);

export default Table;
