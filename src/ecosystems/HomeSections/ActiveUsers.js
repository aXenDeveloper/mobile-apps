import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Animated } from "react-native";
import _ from "underscore";

import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import LargeTitle from "../../atoms/LargeTitle";
import Lang from "../../utils/Lang";
import relativeTime from "../../utils/RelativeTime";
import UserPhoto from "../../atoms/UserPhoto";
import NavigationService from "../../utils/NavigationService";
import styles, { styleVars } from "../../styles";

class ActiveUsers extends Component {
	constructor(props) {
		super(props);
		this._animatedValue = {};
		this._animations = [];
		this.state = {
			tickerReady: false
		};

		this._pressHandlers = {};
	}

	/*
	 * @brief 	How long each name will show for in our ticker animation
	 */
	static animationDelay = 4000;

	/*
	 * @brief 	How many names we'll require to show the ticker. Too few looks a bit daft.
	 */
	static minimumTickerNames = 2;

	/**
	 * Component update
	 *
	 * @param 	object 	prevProps 	Old props
	 * @param 	object	prevState 	Old state
	 * @return 	void
	 */
	componentDidUpdate(prevProps, prevState) {
		// If we have gone from loading to loaded, then set up the ticker animations
		if (prevProps.loading !== this.props.loading) {
			this.setUpTicker();
		}

		// If state change indicates the ticker is ready to start, then do that now
		if (!prevState.tickerReady && this.state.tickerReady) {
			Animated.loop(Animated.stagger(ActiveUsers.animationDelay, this._animations)).start();
		}
	}

	/**
	 * Generate each active user segment
	 *
	 * @return 	array 	Array of cell components
	 */
	getCells() {
		// Take a slice of up to 14 users to show
		const usersToShow = this.props.data.core.activeUsers.users.slice(0, 14);

		return usersToShow.map(user => (
			<View style={componentStyles.cell} key={user.user.name}>
				<TouchableOpacity onPress={this.getPressHandler(user.user)}>
					<UserPhoto url={user.user.photo || null} size={36} online={true} anon={user.anonymous} />
				</TouchableOpacity>
			</View>
		));
	}

	/**
	 * Memoization function returning a press handler for a user
	 *
	 * @return 	array 	Array of cell components
	 */
	getPressHandler(user) {
		if (_.isUndefined(this._pressHandlers[user.id])) {
			this._pressHandlers[user.id] = () => {
				NavigationService.navigate(user.url);
			};
		}

		return this._pressHandlers[user.id];
	}

	/**
	 * Generates the pill that shows how many more users are online, excluding the ones we already showed
	 *
	 * @return 	Component|null
	 */
	getMoreBubble() {
		const activeUsersData = this.props.data.core.activeUsers;

		if (activeUsersData.count - activeUsersData.users.length > 0) {
			return (
				<View style={componentStyles.andMore}>
					<Text style={componentStyles.andMoreText}>+{Lang.pluralize(Lang.get("x_more"), activeUsersData.count - activeUsersData.users.length)}</Text>
				</View>
			);
		}

		return null;
	}

	/**
	 * Sets up the animations for the ticker that shows what users are doing
	 * Note we don't bother doing it if there's less than 3 items to show
	 *
	 * @return 	void
	 */
	setUpTicker() {
		const tickerNamesToUse = this.props.data.core.activeUsers.users.filter(user => _.isString(user.lang));

		// No need to do anything with the ticker if we don't have much to show
		if (tickerNamesToUse.length < ActiveUsers.minimumTickerNames) {
			return;
		}

		this._animations = tickerNamesToUse.map((user, idx) => {
			// First, initialize a value for each user we're going to show in the ticker
			this._animatedValue[user.user.id] = new Animated.Value(0);

			// Now set up the timing function, along with an incremental delay
			return Animated.timing(this._animatedValue[user.user.id], {
				toValue: 1,
				duration: ActiveUsers.animationDelay
			});
		});

		// Setting this state will now cause the ticker to render and begin animating
		this.setState({
			tickerReady: true
		});
	}

	/**
	 * Builds the ticker that shows what users are doing
	 *
	 * @return 	array|null		Array of Animated.Text components
	 */
	getTicker() {
		const tickerNamesToUse = this.props.data.core.activeUsers.users.filter(user => _.isString(user.lang));

		if (tickerNamesToUse.length < ActiveUsers.minimumTickerNames) {
			return null;
		}

		return tickerNamesToUse.map(user => {
			// Since our animated value goes from 0 to 1, we'll use that to create a curve that
			// fades in quickly, stays, then fades out quickly too.
			const opacity = this._animatedValue[user.user.id].interpolate({
				inputRange: [0, 0.05, 0.95, 1],
				outputRange: [0, 1, 1, 0]
			});

			return (
				<Animated.View key={user.user.id} style={[componentStyles.tickerItem, { opacity: opacity }]}>
					<Text style={componentStyles.tickerText} numberOfLines={1}>
						<Text style={styles.lightText}>{relativeTime.short(user.timestamp)} &nbsp;</Text>
						<Text>{user.lang}</Text>
					</Text>
				</Animated.View>
			);
		});
	}

	render() {
		if (this.props.loading) {
			return (
				<View style={[componentStyles.wrapper, styles.row, { height: 100 }]}>
					<PlaceholderElement left={16} top={15} width="60%" />
					<PlaceholderElement circle radius={36} left={16} top={48} />
					<PlaceholderElement circle radius={36} left={64} top={48} />
					<PlaceholderElement circle radius={36} left={112} top={48} />
					<PlaceholderElement circle radius={36} left={160} top={48} />
				</View>
			);
		}

		if (!this.props.data.core.activeUsers.count) {
			return (
				<View style={[componentStyles.wrapper, styles.row]}>
					<Text style={[styles.lightText, styles.mbTight]}>{Lang.get("no_users_online")}</Text>
				</View>
			);
		} else if (this.props.data.core.activeUsers.count && !this.props.data.core.activeUsers.users.length) {
			return (
				<View style={[componentStyles.wrapper, styles.row]}>
					<Text style={[styles.lightText, styles.mbTight]}>{Lang.pluralize(Lang.get("x_guests_online"), this.props.data.core.activeUsers.count)}</Text>
				</View>
			);
		} else {
			return (
				<View style={[componentStyles.wrapper, styles.row]}>
					{Boolean(this.state.tickerReady) && <View style={componentStyles.tickerWrapper}>{this.getTicker()}</View>}
					<View style={componentStyles.cellContainer}>
						{this.getCells()}
						{this.getMoreBubble()}
					</View>
				</View>
			);
		}
	}
}

export default ActiveUsers;

const componentStyles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#fff",
		paddingHorizontal: styleVars.spacing.wide,
		paddingTop: styleVars.spacing.standard,
		paddingBottom: styleVars.spacing.veryTight,
		marginBottom: 15
	},
	cellContainer: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between"
	},
	cell: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		marginRight: styleVars.spacing.standard,
		marginBottom: styleVars.spacing.tight
	},
	username: {
		fontSize: 12
	},
	andMore: {
		height: 36,
		borderRadius: 36,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	andMoreText: {
		color: "#888",
		fontSize: 13
	},
	tickerWrapper: {
		paddingBottom: styleVars.spacing.tight,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
		marginBottom: styleVars.spacing.standard,
		height: 26
	},
	tickerItem: {
		position: "absolute",
		left: 0,
		right: 0
	},
	tickerText: {
		fontSize: 13
	}
});
