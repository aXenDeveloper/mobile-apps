import React, { Component, Fragment } from "react";
import { Text, Image, View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from "react-native";
import { withApollo, compose } from "react-apollo";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import _ from "underscore";

import { receiveAuth, logIn } from "../../../redux/actions/auth";
import Button from "../../../atoms/Button";
import LoginButton from "../../../atoms/LoginButton";
import ToFormData from "../../../utils/ToFormData";
import styles, { styleVars } from "../../../styles";

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

	goToRegistration = () => {
		// For simple registration, just go to the reg screen
		if( this.props.site.settings.allow_reg == 'NORMAL' ){
			this.props.navigation.navigate("Registration");
			return;
		}

		// More complex registration options - full form or third-party URL
		let url;

		if( this.props.site.settings.allow_reg == 'FULL' ){
			url = this.props.site.settings.base_url + '&app=core&module=system&controller=register';
		} else {
			url = this.props.site.settings.allow_reg_target;
		}

		this.props.navigation.navigate("WebView", { url	});
	}

	buildRegistrationLink() {
		return ( 
			<TouchableOpacity onPress={this.goToRegistration}>
				<Text style={[componentStyles.smallText, styles.mtStandard]}>
					Don't have an account? Register now{" "}
					<Image
						source={require("../../../../resources/row_arrow.png")}
						resizeMode="contain"
						style={componentStyles.registerLinkArrow}
					/>
				</Text>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<LinearGradient start={[0, 0]} end={[1, 0]} colors={["#3370AA", "#009BA2"]} style={componentStyles.background}>
					{this.props.auth.loginProcessing || this.props.auth.authenticated ? (
						<View style={componentStyles.pageWrapper}>
							<ActivityIndicator size="large" color="#ffffff" />
						</View>
					) : (
						<React.Fragment>
							{_.isUndefined( this.props.hideClose ) && !this.props.hideClose && (
								<TouchableOpacity onPress={this.close} style={componentStyles.closeButton}>
									<Image source={require("../../../../resources/close.png")} resizeMode="contain" style={componentStyles.closeButtonImage} />
								</TouchableOpacity>
							)}
							<View style={componentStyles.pageWrapper}>
								<View style={componentStyles.logoWrapper}>
									<Image source={require("../../../../resources/logo_light.png")} resizeMode="contain" style={componentStyles.logo} />
								</View>
								<TextInput
									style={componentStyles.textInput}
									autoCorrect={false}
									autoCapitalize="none"
									placeholderTextColor="rgba(255,255,255,0.3)"
									placeholder="Username"
									onChangeText={username => this.setState({ username })}
									value={this.state.username}
								/>

								<TextInput
									style={componentStyles.textInput}
									autoCorrect={false}
									autoCapitalize="none"
									placeholderTextColor="rgba(255,255,255,0.3)"
									placeholder="Password"
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
									secureTextEntry={true}
								/>

								<Button style={styles.mtWide} onPress={() => this._login()} title="Sign In" rounded filled size="large" type="light" />
								{this.props.site.settings.allow_reg !== 'DISABLED' && this.buildRegistrationLink()}
							</View>
							{this.props.site.loginHandlers.length && (
								<LinearGradient start={[0.5, 0]} end={[0.5, 1]} colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.3)"]} style={componentStyles.otherButtonsWrapper}>
									<Text style={[componentStyles.smallText, styles.mbStandard]}>Or sign in with one of these services:</Text>

									<View style={componentStyles.otherButtons}>
										{this.props.site.loginHandlers.map((handler, idx) => (
											<View style={idx > 0 ? styles.mlTight : null} key={handler.id}>
												<LoginButton title={handler.text} icon={handler.icon} color={handler.color} onPress={() => {}} />
											</View>
										))}
									</View>
								</LinearGradient>
							)}
						</React.Fragment>
					)}
				</LinearGradient>
			</View>
		);
	}
}

export default compose(
	withApollo,
	connect(state => ({
		site: state.site,
		auth: state.auth
	}))
)(LoginScreen);

const componentStyles = StyleSheet.create({
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
		justifyContent: 'center',
		padding: styleVars.spacing.veryWide
	},
	textInput: {
		backgroundColor: "rgba(0,0,0,0.1)",
		color: "#fff",
		fontSize: 16,
		padding: 12,
		marginBottom: 8,
		borderRadius: 5
	},
	closeButton: {
		position: "absolute",
		top: 30,
		right: 10
	},
	closeButtonImage: {
		width: 30,
		height: 30,
		tintColor: "#fff"
	},
	smallText: {
		fontSize: styleVars.fontSizes.standard,
		color: "#fff",
		textAlign: "center"
	},
	registerLinkArrow: {
		width: 12,
		height: 14,
		marginTop: -2,
		tintColor: "#fff"
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
	},
	otherButtonsWrapper: {
		paddingHorizontal: styleVars.spacing.veryWide,
		paddingVertical: styleVars.spacing.veryWide
	},
	otherButtons: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%'
	},
	logoWrapper: {
		display: "flex",
		alignItems: "center"
	},
	logo: {
		maxWidth: '70%'
	}
});
