import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./src/redux/configureStore";
import { connect } from "react-redux";
import { Font } from "expo";

import RootScreen from "./src/screens/RootScreen";

const store = configureStore();

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <RootScreen />
      </Provider>
    );
  }
}
