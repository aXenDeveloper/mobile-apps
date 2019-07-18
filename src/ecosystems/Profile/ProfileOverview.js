import React, { Component } from "react";
import { View, SectionList, Dimensions } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import _ from "underscore";

import SectionHeader from "../../atoms/SectionHeader";
import ProfileField from "./ProfileField";
import Lang from "../../utils/Lang";
import ErrorBox from "../../atoms/ErrorBox";
import styles from "../../styles";

class ProfileOverview extends Component {
	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);
		this.renderSectionHeader = this.renderSectionHeader.bind(this);
	}

	renderItem({ item }) {
		return <ProfileField key={item.key} title={item.data.title} value={item.data.value} type={item.data.type} />;
	}

	renderSectionHeader({ section }) {
		return <SectionHeader title={section.title} />;
	}

	render() {
		if (!this.props.isActive) {
			return <View />;
		}

		return <SectionList scrollEnabled={false} renderItem={this.renderItem} renderSectionHeader={this.renderSectionHeader} sections={this.props.profileData} />;
	}
}

export default ProfileOverview;
