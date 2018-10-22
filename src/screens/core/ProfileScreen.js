import React, { Component } from "react";
import { Text, View, ScrollView, SectionList, StyleSheet, Image, StatusBar, Animated, Platform } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import HeaderBackButton from "react-navigation";
//import ScrollableTabView, { ScrollableTabBar } from "react-native-scrollable-tab-view";
import { List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base";
import { Header } from "react-navigation";
import FadeIn from "react-native-fade-in-image";

import CustomTab from "../../atoms/CustomTab";
import FollowButton from "../../atoms/FollowButton";
import Button from "../../atoms/Button";
import ListItem from "../../atoms/ListItem";
import SectionHeader from "../../atoms/SectionHeader";
import relativeTime from "../../utils/RelativeTime";
import UserPhoto from "../../atoms/UserPhoto";
import CustomHeader from "../../ecosystems/CustomHeader";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import styles, { styleVars } from "../../styles";

const ProfileQuery = gql`
	query ProfileQuery($member: ID!) {
		core {
			member(id: $member) {
				id
				name
				email
				photo
				contentCount
				reputationCount
				followerCount
				joined
				group {
					name
				}
				coverPhoto {
					image
					offset
				}
				customFieldGroups {
					id
					title
					fields {
						id
						title
						value
						type
					}
				}
			}
		}
	}
`;

class ProfileScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTransparent: true,
		header: props => {
			return <Header {...props} />;
		}
	});

	// Animation scroll values
	nScroll = new Animated.Value(0);
	scroll = new Animated.Value(0);
	heights = [500];

	constructor(props) {
		super(props);
		this.state = {
			tabHeight: 500,
			activeTab: 0,
			headerHeight: 250
		};
		this.nScroll.addListener(Animated.event([{ value: this.scroll }], { useNativeDriver: false }));
		this.buildAnimations();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.headerHeight !== this.state.headerHeight) {
			this.buildAnimations();
		}
	}

	buildAnimations() {
		const HEADER_HEIGHT = Platform.OS === "ios" ? 76 : 50;
		const SCROLL_HEIGHT = this.state.headerHeight - HEADER_HEIGHT;

		// Interpolate methods for animations
		this.userOpacity = this.scroll.interpolate({
			inputRange: [0, SCROLL_HEIGHT / 2, SCROLL_HEIGHT],
			outputRange: [1, 0.1, 0]
		});
		this.tabY = this.nScroll.interpolate({
			inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
			outputRange: [0, 0, 1]
		});
		this.imgScale = this.nScroll.interpolate({
			inputRange: [-75, 0, 50],
			outputRange: [1.7, 1, 1.2],
			extrapolateLeft: "clamp"
		});
		this.fixedHeaderOpacity = this.scroll.interpolate({
			inputRange: [0, SCROLL_HEIGHT],
			outputRange: [0, 1]
		});
	}

	tabContent(x, i) {
		return (
			<View style={{ height: this.state.height }}>
				<List
					onLayout={({
						nativeEvent: {
							layout: { height }
						}
					}) => {
						this.heights[i] = height;
						if (this.state.activeTab === i) this.setState({ height });
					}}
				>
					{new Array(x).fill(null).map((_, i) => (
						<Item key={i}>
							<Text>Item {i}</Text>
						</Item>
					))}
				</List>
			</View>
		);
	}

	render() {
		if (this.props.data.loading) {
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else {
			const customFields = [];

			customFields.push({
				title: "Basic Information",
				data: [
					{
						key: "joined",
						data: {
							id: "joined",
							title: "Joined",
							value: relativeTime.long(this.props.data.core.member.joined),
							html: false
						}
					}
				]
			});

			if (this.props.data.core.member.customFieldGroups.length) {
				this.props.data.core.member.customFieldGroups.map(group => {
					customFields.push({
						title: group.title,
						data: group.fields.map(field => ({
							key: field.id,
							data: {
								id: field.id,
								title: field.title,
								value: field.value,
								html: field.type == "Editor"
							}
						}))
					});
				});
			}

			return (
				<View>
					<StatusBar barStyle="light-content" translucent />
					<Animated.View style={[componentStyles.fixedProfileHeader, { opacity: this.fixedHeaderOpacity }]}>
						<CustomHeader
							content={
								<View style={{ paddingTop: 26 }}>
									<TwoLineHeader title={this.props.data.core.member.name} subtitle={this.props.data.core.member.group.name} />
								</View>
							}
						/>
					</Animated.View>
					<Animated.ScrollView
						showsVerticalScrollIndicator={false}
						scrollEventThrottle={5}
						style={{ zIndex: 0 }}
						onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.nScroll } } }], { useNativeDriver: true })}
					>
						<Animated.View
							onLayout={({
								nativeEvent: {
									layout: { height }
								}
							}) => {
								this.setState({ headerHeight: height });
							}}
							style={componentStyles.profileHeader}
						>
							{this.props.data.core.member.coverPhoto.image && (
								<Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: this.imgScale }] }]}>
									<FadeIn style={StyleSheet.absoluteFill} placeholderStyle={{ backgroundColor: "#333" }}>
										<Image
											source={{ uri: this.props.data.core.member.coverPhoto.image }}
											style={StyleSheet.absoluteFill}
											resizeMode="cover"
										/>
									</FadeIn>
								</Animated.View>
							)}
							<Animated.View style={[componentStyles.profileHeaderInner, { opacity: this.userOpacity }]}>
								<UserPhoto url={this.props.data.core.member.photo} size={80} />
								<Text style={componentStyles.usernameText}>{this.props.data.core.member.name}</Text>
								<Text style={componentStyles.groupText}>{this.props.data.core.member.group.name}</Text>
								<View style={[styles.mtWide, componentStyles.buttonBar]}>
									<Button filled rounded type="light" size="medium" title="Follow" style={componentStyles.button} />
									<Button filled rounded type="light" size="medium" title="Message" style={componentStyles.button} />
								</View>
								<View style={[styles.mtWide, componentStyles.profileStats]}>
									<View style={[componentStyles.profileStatSection, componentStyles.profileStatSectionBorder]}>
										<Text style={componentStyles.profileStatCount}>{this.props.data.core.member.contentCount}</Text>
										<Text style={componentStyles.profileStatTitle}>Content Count</Text>
									</View>
									<View style={[componentStyles.profileStatSection, componentStyles.profileStatSectionBorder]}>
										<Text style={componentStyles.profileStatCount}>{this.props.data.core.member.reputationCount}</Text>
										<Text style={componentStyles.profileStatTitle}>Reputation</Text>
									</View>
									<View style={componentStyles.profileStatSection}>
										<Text style={componentStyles.profileStatCount}>{this.props.data.core.member.followerCount}</Text>
										<Text style={componentStyles.profileStatTitle}>Followers</Text>
									</View>
								</View>
							</Animated.View>
						</Animated.View>
						<Animated.View style={[componentStyles.profileTabBar]}>
							<Tabs
								renderTabBar={props => (
									<Animated.View style={{ transform: [{ translateY: this.tabY }], zIndex: 1 }}>
										<ScrollableTab
											{...props}
											onChangeTab={({ i }) => {
												this.setState({ height: this.heights[i], activeTab: i });
											}}
											renderTab={(name, page, active, onPress, onLayout) => (
												<CustomTab key={name} name={name} page={page} active={active} onPress={onPress} onLayout={onLayout} />
											)}
										/>
									</Animated.View>
								)}
								tabBarUnderlineStyle={styleVars.tabBar.underline}
							>
								<Tab heading="Profile">
									<SectionList
										scrollEnabled={false}
										renderItem={({ item }) => <ListItem key={item.key} data={item.data} />}
										renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
										sections={customFields}
									/>
								</Tab>
								<Tab heading="Content">{this.tabContent(40, 1)}</Tab>
								<Tab heading="About Me">{this.tabContent(10, 2)}</Tab>
								<Tab heading="Followers">{this.tabContent(20, 3)}</Tab>
							</Tabs>
						</Animated.View>
					</Animated.ScrollView>
				</View>
			);
		}
	}
}

const componentStyles = StyleSheet.create({
	fixedProfileHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100
	},
	profileHeader: {
		backgroundColor: "#333"
	},
	profileHeaderInner: {
		paddingTop: 40,
		backgroundColor: "rgba(49,68,83,0.4)",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	},
	usernameText: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "bold",
		marginTop: 7,
		textShadowColor: "rgba(0,0,0,0.8)",
		textShadowOffset: { width: 1, height: 1 }
	},
	groupText: {
		color: "#fff",
		fontSize: 15,
		textShadowColor: "rgba(0,0,0,0.8)",
		textShadowOffset: { width: 1, height: 1 }
	},
	profileStats: {
		backgroundColor: "rgba(20,20,20,0.8)",
		paddingTop: styleVars.spacing.standard,
		paddingBottom: styleVars.spacing.standard,
		display: "flex",
		flexDirection: "row"
	},
	profileStatSection: {
		flex: 1
	},
	profileStatSectionBorder: {
		borderRightWidth: 1,
		borderRightColor: "rgba(255,255,255,0.1)"
	},
	profileStatCount: {
		color: "#fff",
		textAlign: "center",
		fontSize: 17,
		fontWeight: "500"
	},
	profileStatTitle: {
		color: "#8F8F8F",
		fontSize: 11,
		textAlign: "center"
	},
	buttonBar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	button: {
		width: "100%",
		maxWidth: 130,
		marginHorizontal: styleVars.spacing.tight
	}
});

export default graphql(ProfileQuery, {
	options: props => ({
		variables: {
			member: props.navigation.state.params.id
		}
	})
})(ProfileScreen);
