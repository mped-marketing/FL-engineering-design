import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';


const Table = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/blogs/viewblogs/all`} />
    <Route path={`${match.url}/settings`} component={asyncComponent(() => import('./Settings'))} />
    <Route path={`${match.url}/viewblogs/:status`} component={asyncComponent(() => import('./ViewBlogs'))} />
    <Route path={`${match.url}/add`} component={asyncComponent(() => import('./AddBlog'))} />
    <Route path={`${match.url}/:id`} component={asyncComponent(() => import('./EditBlog'))} />
  </Switch>
);

export default Table;
