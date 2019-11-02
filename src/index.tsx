import * as React from "react";
import { render } from "react-dom";
import { Provider } from "mobx-react";
import App from "./App";
import AppState from "./AppState";

const rootElement = document.getElementById("root");
render(
  <Provider {...AppState}>
    <App />
  </Provider>,
  rootElement
);
