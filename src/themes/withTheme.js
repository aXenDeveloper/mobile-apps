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
			const { styleVars, styles, componentStyles } = this.getThemeValues();

			this.state = {
				styleVars,
				styles,
				componentStyles
			};
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
				const { styleVars, styles, componentStyles } = this.getThemeValues();

				this.setState({
					styleVars,
					styles,
					componentStyles
				});
			}
		}

		getThemeValues() {
			const themeObj = this.getThemeFromKey(this.props.theme);
			const styleVars = buildStyleVars(themeObj, this.props.darkMode);
			const styles = generateStyleSheet(themeObj, this.props.darkMode);
			const componentStyles = this.getComponentStyles(styleVars);

			return { styleVars, styles, componentStyles };
		}

		getThemeFromKey(theme) {
			if (_.isString(theme)) {
				return themes[theme];
			} else {
				return theme;
			}
		}

		render() {
			return <WrappedComponent styleVars={this.state.styleVars} styles={this.state.styles} componentStyles={this.state.componentStyles} {...this.props} />;
		}
	}

	// This is necessary to bring static properties (e.g. react-navigation data) from components into the wrapped component
	hoistNonReactStatics(wrappedClass, WrappedComponent);

	return connect(state => ({
		theme: state.app.currentTheme,
		darkMode: state.app.darkMode
	}))(wrappedClass);
};

export default withTheme;
