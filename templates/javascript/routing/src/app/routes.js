import React from "react";
import { Route } from "react-router-dom";

import AppComponent from "../../../basic/src/app/app.component";

export const routes = [
  {
    path: "/",
    load: AppComponent,
    routes: [
      // {
      //     path: "/child",
      //     load: ChildModuleOrComponent
      // }
    ]
  }
];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
export class RouteWithSubRoutes extends React.Component {
  render() {
    const route = this.props;
    return (
      <Route
        path={route.path}
        render={props => (
          // pass the sub-routes down to keep nesting
          <route.load {...props} routes={route.routes} />
        )}
      />
    );
  }
}
