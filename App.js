import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./src/redux/configureStore";
import { connect } from "react-redux";
import Sentry from "sentry-expo";

global.Buffer = global.Buffer || require("buffer").Buffer;

import AppRoot from "./src/screens/ips/AppRoot";

const store = configureStore();

/*if (process.env.NODE_ENV !== 'production') {
const {whyDidYouUpdate} = require('why-did-you-update');
whyDidYouUpdate(React, { include: [/^Post/], exclude: /^YellowBox/ });
}*/

// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true;
Sentry.config("https://7ebe0255a311425c8edb883ad65e5002@sentry.io/1429754").install();

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Provider store={store}>
				<AppRoot />
			</Provider>
		);
	}
}
