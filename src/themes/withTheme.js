import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";
import hoistNonReactStatics from "hoist-non-react-statics";

import { generateStyleSheet, buildStyleVars } from "./index";
import * as themes from "./themes";

const withTheme = (passedComponentStyles = null) => WrappedComponent => {
	class wrappedClass extends Component {
		constructor(props) {
			super(props);
			this.updateThemeState();
		}

		getComponentStyles(styleVars) {
			let componentStyles = {};
			if (passedComponentStyles !== null) {
				componentStyles = StyleSheet.create(
					_.isFunction(passedComponentStyles) ? passedComponentStyles(styleVars, this.props.darkMode) : passedComponentStyles
				);
			}

			return componentStyles;
		}

		componentDidUpdate(prevProps) {
			if (prevProps.theme !== this.props.theme || prevProps.darkMode !== this.props.darkMode) {
				this.updateThemeState();
			}
		}

		updateThemeState() {
			const styleVars = buildStyleVars(this.props.theme, this.props.darkMode);
			const styles = generateStyleSheet(this.props.theme, this.props.darkMode);
			const componentStyles = this.getComponentStyles(styleVars);

			this.state = {
				styleVars,
				styles,
				componentStyles
			};
		}

		render() {
			return <WrappedComponent styleVars={this.state.styleVars} styles={this.state.styles} componentStyles={this.state.componentStyles} {...this.props} />;
		}
	}

	hoistNonReactStatics(wrappedClass, WrappedComponent);

	return connect(state => ({
		theme: state.app.currentTheme,
		darkMode: state.app.darkMode
	}))(wrappedClass);
};

export default withTheme;
