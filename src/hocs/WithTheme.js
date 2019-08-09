import React, { Component } from "react";
import { Text, View, FlatList, ScrollView } from "react-native";
import { connect } from "react-redux";

import styles, { styleVars } from "../styles";

function withTheme(WrappedComponent) {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				styleVars: {
					accentColor: styleVars.accentColor
				},
				theme: styles
			};
		}

		componentDidMount() {
			setTimeout(() => {
				this.setState({
					styleVars: {
						...this.state.styleVars,
						accentColor: "red"
					}
				});
			}, 4000);
		}

		render() {
			return <WrappedComponent styleVars={this.state.styleVars} theme={this.state.styles} {...this.props} />;
		}
	};
}

export default withTheme;
