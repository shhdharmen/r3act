import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { routes, RouteWithSubRoutes } from "./routes";

export default class AppRoutingModule extends Component {
  render() {
    return (
      <Router>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}></RouteWithSubRoutes>
        ))}
      </Router>
    );
  }
}
