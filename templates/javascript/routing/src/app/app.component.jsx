import React, { Component } from "react";
import logo from "../assets/images/logo.png";
import "./app.component.css";
import { RouteWithSubRoutes } from "./routes";
export default class AppComponent extends Component {
  render() {
    return (
      <div className="r3act-container">
        <img src={logo} className="img-fluid" height="200" alt="r3act logo" />
        <h1>Welcome to r3act</h1>
        {this.props.routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </div>
    );
  }
}
