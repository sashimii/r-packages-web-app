import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import './Routes.scss';
import Event from './views/Event';

interface RoutesProps {}

export const Routes: React.SFC<RoutesProps> = () => {
  return (
    <div className="routes">
      <nav>
        <h1 className="routes__site-title">
          <Link to="/">
            R Packages
          </Link>
        </h1>
      </nav>
      <Switch>
        <Route
          exact
          path="/:eventName"
          component={Event}
        />
        {/* <Route exact path="/">
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
        /> */}
      </Switch>
    </div>
  );
};