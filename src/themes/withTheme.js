import React, { PureComponent } from "react";
import { Text, View, FlatList, ScrollView } from "react-native";
import { connect } from "react-redux";

import { generateStyleSheet, buildStyleVars } from "./index";
import * as themes from "./themes";
import styles, { styleVars } from "../styles";

function withTheme(WrappedComponent) {
	class wrappedClass extends PureComponent {
		constructor(props) {
			super(props);

			this.state = {
				styleVars: buildStyleVars(this.props.theme, this.props.darkMode),
				styles: generateStyleSheet(this.props.theme, this.props.darkMode)
			};
		}

		componentDidUpdate(prevProps) {
			if (prevProps.theme !== this.props.theme || prevProps.darkMode !== this.props.darkMode) {
				this.setState({
					styleVars: buildStyleVars(this.props.theme, this.props.darkMode),
					styles: generateStyleSheet(this.props.theme, this.props.darkMode)
				});
			}
		}

		render() {
			console.log("RENDERED WITHTHEME");
			return <WrappedComponent styleVars={this.state.styleVars} styles={this.state.styles} {...this.props} />;
		}
	}

	return connect(state => ({
		theme: state.app.currentTheme,
		darkMode: state.app.darkMode
	}))(wrappedClass);
}

export default withTheme;
