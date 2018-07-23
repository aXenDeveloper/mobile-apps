import React, { Component, Fragment } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from "react-native";
import { withApollo } from "react-apollo";
import { LinearGradient } from "expo";
import { connect } from "react-redux";

import { receiveAuth, logIn } from "../../redux/actions/auth";
import ToFormData from "../../utils/ToFormData";

class LoginScreen extends Component {
	static navigationOptions = {
		title: "Sign In",
		headerMode: "none"
	};

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: ""
		};
	}

	/**
	 * Dispatch a login action containing our credentials
	 * We also need to pass our ApolloClient instance into the action, so that it can
	 * reset the store after logging in.
	 *
	 * @return 	void
	 */
	_login() {
		const { dispatch } = this.props;
		dispatch(logIn(this.state.username, this.state.password, this.props.client));
	}

	/**
	 * If we're now authenticated, redirect to our Root component
	 *
	 * @param 	object 	nextProps 	New props
	 * @return 	void
	 */
	componentWillUpdate(nextProps) {
		if (nextProps.auth.authenticated) {
			this.props.navigation.navigate("Root");
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<LinearGradient start={[0, 0]} end={[1, 0]} colors={["#3370AA", "#009BA2"]} style={styles.background}>
					{this.props.auth.loginProcessing || this.props.auth.authenticated ? (
						<View style={styles.pageWrapper}>
							<ActivityIndicator size="large" color="#ffffff" />
						</View>
					) : (
						<View style={styles.pageWrapper}>
							<Text>Sign In</Text>
							<TextInput
								style={styles.textInput}
								autoCorrect={false}
								autoCapitalize="none"
								placeholderTextColor="rgba(255,255,255,0.3)"
								placeholder="Username"
								onChangeText={username => this.setState({ username })}
								value={this.state.username}
							/>

							<TextInput
								style={styles.textInput}
								autoCorrect={false}
								autoCapitalize="none"
								placeholderTextColor="rgba(255,255,255,0.3)"
								placeholder="Password"
								onChangeText={password => this.setState({ password })}
								value={this.state.password}
								secureTextEntry={true}
							/>

							<TouchableOpacity style={styles.button} onPress={() => this._login()}>
								<Text style={styles.buttonText}>Sign In</Text>
							</TouchableOpacity>
						</View>
					)}
				</LinearGradient>
			</View>
		);
	}
}

export default connect(state => {
	return state;
})(withApollo(LoginScreen));

const styles = StyleSheet.create({
	background: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: "100%"
	},
	pageWrapper: {
		flex: 1,
		backgroundColor: "transparent",
		marginTop: 150,
		padding: 20
	},
	textInput: {
		backgroundColor: "rgba(0,0,0,0.1)",
		color: "#fff",
		fontSize: 16,
		padding: 12,
		marginBottom: 8,
		borderRadius: 5
	},
	button: {
		backgroundColor: "white",
		padding: 12,
		borderRadius: 5,
		marginTop: 15
	},
	buttonText: {
		fontSize: 16,
		textAlign: "center"
	}
});
