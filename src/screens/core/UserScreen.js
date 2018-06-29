import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList, StyleSheet, Alert } from "react-native";
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import { connect } from "react-redux";
import { logOut } from "../../redux/actions/auth";

import UserPhoto from "../../atoms/UserPhoto";
import auth from "../../utils/Auth";

const UserQuery = gql`
	query UserQuery {
		core {
			member(loggedIn: true) {
				name
				email
				photo
			}
		}
	}
`;

class UserScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: "Account"
	});

	constructor(props) {
		super(props);
	}

	_logOut() {
		const { dispatch } = this.props;

		Alert.alert("Confirm", "Are you sure you want to log out on this device?", [
			{ text: "Cancel", onPress: () => console.log("Canceled") },
			{ text: "Log Out", onPress: () => dispatch(logOut(this.props.client)), style: "destructive" }
		]);
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.props.auth.authenticated && !nextProps.auth.authenticated) {
			this.props.navigation.navigate("Root");
		}
	}

	render() {
		if (this.props.data.loading) {
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else {
			return (
				<View style={styles.loggedInHeader}>
					<UserPhoto url={this.props.photo} size={100} />
					<Text style={styles.username}>{this.props.data.core.member.name}</Text>
					<Button onPress={() => this._logOut()} style={styles.button} title="Sign Out" />
				</View>
			);
		}
	}
}

export default graphql(UserQuery)(
	connect(state => {
		return state;
	})(withApollo(UserScreen))
);

const styles = StyleSheet.create({
	loggedInHeader: {
		display: "flex",
		alignItems: "center",
		marginTop: 50
	},
	username: {
		fontSize: 24,
		marginTop: 10
	}
});
