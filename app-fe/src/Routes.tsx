import * as React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import Author from './views/Author';
import Package from './views/Package';
import PackageList from './views/PackageList';

import './App.scss';

interface RoutesProps {}

export const Routes: React.SFC<RoutesProps> = () => {
  return (
    <div>
      <nav className="navigation">
        <Link to="/">
          <h1 className="navigation__site-title">R Packages</h1>
        </Link>
      </nav>
      <Switch>
        <Route
          exact
          path="/package-list"
          component={PackageList}
        />
        <Route exact path="/">
          <Redirect to="/package-list" />
        </Route>
        <Route
          exact
          path="/package/:packageId"
          component={Package}
        />
        <Route
          exact
          path="/author/:authorId"
          component={Author}
        />
      </Switch>
    </div>
  );
};