import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { connect } from "react-redux";

import Badge from "../../atoms/Badge";
import NavigationTabIcon from "./NavigationTabIcon";
import styles, { styleVars } from "../../styles";

const NavigationTabNotification = (props) => {	
	return (
		<NavigationTabIcon {...props}>
			{props.user.notificationCount > 0 && <Badge count={props.user.notificationCount} style={componentStyles.notificationBadge} />}
		</NavigationTabIcon>
	);
}

export default connect(state => ({
	user: state.user,
}))(NavigationTabNotification);

const componentStyles = StyleSheet.create({
	notificationBadge: {
		position: 'absolute',
		top: -11,
		right: -8,
	}
});