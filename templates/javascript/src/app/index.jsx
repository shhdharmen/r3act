import React, { Component } from "react";
import logo from "../assets/images/logo.png";

export default class App extends Component {
  render() {
    return (
      <div className="r3act-container">
        <img src={logo} className="img-fluid" height="200" alt="" />
        <h1>Welcome to r3act</h1>
      </div>
    );
  }
}
