import React from "react";
import ReactDOM from "react-dom";

import "./styles/main.css";

import * as serviceWorker from "./serviceWorker";
import AppModule from "./app/app.module";

ReactDOM.render(<AppModule />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
