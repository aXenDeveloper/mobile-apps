import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./src/redux/configureStore";
import { connect } from "react-redux";
import { Font } from "expo";

import CommunityRootScreen from "./src/screens/ips/CommunityRootScreen";

const store = configureStore();

/*if (process.env.NODE_ENV !== 'production') {
	const {whyDidYouUpdate} = require('why-did-you-update');
	whyDidYouUpdate(React, { include: [/^Post/], exclude: /^YellowBox/ });
}*/

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <CommunityRootScreen />
      </Provider>
    );
  }
}
