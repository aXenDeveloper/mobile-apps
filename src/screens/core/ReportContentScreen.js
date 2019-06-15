import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet, TextInput, Image, SectionList, AsyncStorage, ActivityIndicator, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { ScrollableTab, Tab, TabHeading, Tabs } from "native-base";

import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

class ReportContentScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	/**
	 * On mount, load our recent searches from storage then update state
	 *
	 * @return 	void
	 */
	componentDidMount() {}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Text>Report</Text>
			</View>
		);
	}
}

export default compose(
	connect(state => ({
		app: state.app,
		site: state.site
	})),
	withApollo
)(ReportContentScreen);

const componentStyles = StyleSheet.create({});
