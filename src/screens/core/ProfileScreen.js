import React, { Component } from "react";
import { Text, View, ScrollView, SectionList, StyleSheet, Image, StatusBar, Animated, Platform, Dimensions, Alert } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import HeaderBackButton from "react-navigation";
//import ScrollableTabView, { ScrollableTabBar } from "react-native-scrollable-tab-view";
import { List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base";
import { Header } from "react-navigation";
import FadeIn from "react-native-fade-in-image";

import Lang from "../../utils/Lang";
import { pushToast } from "../../redux/actions/app";
import CustomTab from "../../atoms/CustomTab";
import ErrorBox from "../../atoms/ErrorBox";
import getErrorMessage from "../../utils/getErrorMessage";
import FollowButton from "../../atoms/FollowButton";
import Button from "../../atoms/Button";
import ListItem from "../../atoms/ListItem";
import SectionHeader from "../../atoms/SectionHeader";
import relativeTime from "../../utils/RelativeTime";
import UserPhoto from "../../atoms/UserPhoto";
import CustomHeader from "../../ecosystems/CustomHeader";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import RichTextContent from "../../ecosystems/RichTextContent";
import { ProfileContent, ProfileTab, ProfileFollowers, ProfilePlaceholder, ProfileField } from "../../ecosystems/Profile";
import { FollowModal, FollowModalFragment, FollowMutation, UnfollowMutation } from "../../ecosystems/FollowModal";
import getImageUrl from "../../utils/getImageUrl";
import { isIphoneX } from "../../utils/isIphoneX";
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
				joined
				allowFollow
				group {
					name
				}
				coverPhoto {
					image
					offset
				}
				follow {
					...FollowModalFragment
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
	${FollowModalFragment}
`;

class ProfileScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTransparent: true,
		header: props => {
			return <Header {...props} />;
		}
	});

	static errors = {
		CANT_FOLLOW_SELF: "Can't follow self",
		CANT_FOLLOW_MEMBER: "Can't follow member"
	};

	constructor(props) {
		super(props);

		this._followTimeout = null;
		this._nScroll = new Animated.Value(0);
		this._scroll = new Animated.Value(0);
		this._heights = [];
		this._nScroll.addListener(Animated.event([{ value: this._scroll }], { useNativeDriver: false }));

		this.state = {
			tabHeight: 400,
			activeTab: 0,
			fullHeaderHeight: 250,
			followModalVisible: false
		};

		this.buildAnimations();
	}

	componentWillUnmount() {
		clearTimeout(this._followTimeout);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.fullHeaderHeight !== this.state.fullHeaderHeight) {
			this.buildAnimations();
		}

		if (prevState.smallHeaderHeight !== this.state.smallHeaderHeight) {
			const windowDims = Dimensions.get("window");

			this.setState({
				minHeight: windowDims.height - this.state.smallHeaderHeight - 100
			});
		}
	}

	/**
	 * Event handler for following the forum
	 *
	 * @param 	object 		followData 		Object with the selected values from the modal
	 * @return 	void
	 */
	onFollow = followData => {
		this.setState({
			followModalVisible: false
		});

		// Put in a short timeout to allow the modal to hide, otherwise
		// our optimisticResponse will cause the modal contents to switch while we
		// can still see it
		this._followTimeout = setTimeout(async () => {
			try {
				await this.props.client.mutate({
					mutation: FollowMutation,
					variables: {
						app: "core",
						area: "member",
						id: this.props.data.core.member.id,
						anonymous: followData.anonymous,
						type: "IMMEDIATE"
					},
					optimisticResponse: {
						mutateCore: {
							__typename: "mutate_Core",
							follow: {
								...this.props.data.core.member.follow,
								isFollowing: true
							}
						}
					},
					refetchQueries: ["ProfileFollowersQuery"]
				});

				this.props.dispatch(
					pushToast({
						message: Lang.get("followed_member", { name: this.props.data.core.member.name })
					})
				);
			} catch (err) {
				Alert.alert(Lang.get("error"), Lang.get("error_following"), [{ text: Lang.get("ok") }], { cancelable: false });
			}
		}, 300);
	};

	/**
	 * Event handler for unfollowing the forum
	 *
	 * @return 	void
	 */
	onUnfollow = () => {
		this.setState({
			followModalVisible: false
		});

		// Put in a short timeout to allow the modal to hide, otherwise
		// our optimisticResponse will cause the modal contents to switch while we
		// can still see it
		this._followTimeout = setTimeout(async () => {
			try {
				await this.props.client.mutate({
					mutation: UnfollowMutation,
					variables: {
						app: "core",
						area: "member",
						id: this.props.data.core.member.id,
						followID: this.props.data.core.member.follow.followID
					},
					optimisticResponse: {
						mutateCore: {
							__typename: "mutate_Core",
							unfollow: {
								...this.props.data.core.member.follow,
								isFollowing: false
							}
						}
					},
					refetchQueries: ["ProfileFollowersQuery"]
				});

				this.props.dispatch(
					pushToast({
						message: Lang.get("unfollowed_member", { name: this.props.data.core.member.name })
					})
				);
			} catch (err) {
				Alert.alert(Lang.get("error"), Lang.get("error_unfollowing"), [{ text: Lang.get("ok") }], { cancelable: false });
			}
		}, 300);
	};

	buildAnimations() {
		const HEADER_HEIGHT = Platform.OS === "ios" ? (isIphoneX() ? 96 : 76) : 50;
		const SCROLL_HEIGHT = this.state.fullHeaderHeight - HEADER_HEIGHT;

		// Interpolate methods for animations
		this.userOpacity = this._scroll.interpolate({
			inputRange: [0, SCROLL_HEIGHT / 2, SCROLL_HEIGHT],
			outputRange: [1, 0.3, 0]
		});
		this.tabY = this._nScroll.interpolate({
			inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
			outputRange: [0, 0, 1]
		});
		this.avatarScale = this._nScroll.interpolate({
			inputRange: [0, SCROLL_HEIGHT],
			outputRange: [1, 0.5],
			extrapolateLeft: "clamp"
		});
		this.imgScale = this._nScroll.interpolate({
			inputRange: [-75, 0, 50],
			outputRange: [1.7, 1, 1.2],
			extrapolateLeft: "clamp"
		});
		this.fixedHeaderOpacity = this._scroll.interpolate({
			inputRange: [0, SCROLL_HEIGHT / 2, SCROLL_HEIGHT * 0.8],
			outputRange: [0, 0.1, 1]
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
						this._heights[i] = height;
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

	/**
	 * Toggles between showing/hiding the follow modal
	 *
	 * @return 	void
	 */
	toggleFollowModal = () => {
		this.setState({
			followModalVisible: !this.state.followModalVisible
		});
	};

	getProfileFields() {
		const customFields = [];

		customFields.push({
			title: Lang.get("basic_information"),
			data: [
				{
					key: "joined",
					data: {
						id: "joined",
						title: Lang.get("joined"),
						// Since our CustomField component expects JSON field data, we have to re-json this
						value: JSON.stringify(String(this.props.data.core.member.joined)),
						type: "Date"
					}
				},
				...(this.props.data.core.member.email
					? [
							{
								key: "email",
								data: {
									id: "email",
									title: Lang.get("email_address"),
									// Since our CustomField component expects JSON field data, we have to re-json this
									value: JSON.stringify(this.props.data.core.member.email),
									type: "Email"
								}
							}
					  ]
					: [])
			]
		});

		if (this.props.data.core.member.customFieldGroups.length) {
			this.props.data.core.member.customFieldGroups.forEach(group => {
				if (!group.fields.length) {
					return;
				}

				const fields = [];

				// Loop through each field, and only add it if it isn't an editor
				// Editor fields will show in their own tab thanks to getAdditionalTabs()
				group.fields.forEach(field => {
					if (field.type !== "Editor") {
						fields.push({
							key: field.id,
							data: field
						});
					}
				});

				// If we have any fields to show, add them to the result
				if (fields.length) {
					customFields.push({
						title: group.title,
						data: fields
					});
				}
			});
		}

		return customFields;
	}

	getAdditionalTabs() {
		const additionalTabs = [];

		if (this.props.data.core.member.customFieldGroups.length) {
			this.props.data.core.member.customFieldGroups.forEach(group => {
				if (group.fields.length) {
					group.fields.forEach(field => {
						if (field.type == "Editor") {
							additionalTabs.push(field);
						}
					});
				}
			});
		}

		return additionalTabs;
	}

	renderTabBar = props => {
		return (
			<Animated.View style={{ transform: [{ translateY: this.tabY }], zIndex: 1 }}>
				<ScrollableTab
					{...props}
					prerenderingSiblingsNumber={3}
					renderTab={(name, page, active, onPress, onLayout) => (
						<CustomTab key={name} name={name} page={page} active={active} onPress={onPress} onLayout={onLayout} />
					)}
				/>
			</Animated.View>
		);
	};
	/*onTabLayout = ({height, tabIndex}) => {
		const windowDims = Dimensions.get('window');
		const HEADER_HEIGHT = Platform.OS === "ios" ? 76 : 50;

		this._heights[tabIndex] = Math.max( (windowDims.height - this.state.smallHeaderHeight - HEADER_HEIGHT), this._heights[tabIndex] );

		//console.log("Got height " + height + " for tabIndex " + tabIndex);

		if( this.state.activeTab == tabIndex ){
			//console.log("Tab " + tabIndex + " is active, set height state to " + Math.max( (windowDims.height - this.state.smallHeaderHeight - HEADER_HEIGHT), this._heights[tabIndex] ) );

			this.setState({
				tabHeight: this._heights[tabIndex]
			});
		}
	}*/

	render() {
		if (this.props.data.loading && this.props.data.networkStatus !== 3 && this.props.data.networkStatus !== 4) {
			return <ProfilePlaceholder />;
		} else if (this.props.data.error) {
			const error = getErrorMessage(this.props.data.error, ProfileScreen.errors);
			const message = error ? error : Lang.get("topic_view_error");
			return <ErrorBox message={message} />;
		} else {
			// Follow button
			let showFollowButton = false;
			if (
				this.props.user.id &&
				this.props.data.core.member.id !== this.props.user.id &&
				(this.props.data.core.member.allowFollow || this.props.data.core.member.follow.isFollowing)
			) {
				showFollowButton = true;
			}

			// Additional tabs for custom profile fields
			const additionalTabs = this.getAdditionalTabs();

			return (
				<View>
					<StatusBar barStyle="light-content" translucent />
					<FollowModal
						isVisible={this.state.followModalVisible}
						followData={this.props.data.core.member.follow}
						onFollow={this.onFollow}
						onUnfollow={this.onUnfollow}
						close={this.toggleFollowModal}
					/>
					<Animated.View
						style={[componentStyles.fixedProfileHeader, { opacity: this.fixedHeaderOpacity }]}
						onLayout={e => {
							this.setState({ smallHeaderHeight: e.nativeEvent.layout.height });
						}}
					>
						<CustomHeader
							content={
								<View style={{ paddingTop: isIphoneX() ? 46 : 26 }}>
									<TwoLineHeader title={this.props.data.core.member.name} subtitle={this.props.data.core.member.group.name} />
								</View>
							}
						/>
					</Animated.View>
					<Animated.ScrollView
						showsVerticalScrollIndicator={false}
						scrollEventThrottle={5}
						style={{ zIndex: 0 }}
						onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this._nScroll } } }], { useNativeDriver: true })}
					>
						<Animated.View
							onLayout={e => {
								this.setState({ fullHeaderHeight: e.nativeEvent.layout.height });
							}}
							style={componentStyles.profileHeader}
						>
							{Boolean(this.props.data.core.member.coverPhoto.image) && (
								<Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: this.imgScale }] }]}>
									<FadeIn style={StyleSheet.absoluteFill} placeholderStyle={{ backgroundColor: "#333" }}>
										<Image source={{ uri: getImageUrl(this.props.data.core.member.coverPhoto.image) }} style={StyleSheet.absoluteFill} resizeMode="cover" />
									</FadeIn>
								</Animated.View>
							)}
							<Animated.View style={[componentStyles.profileHeaderInner, { opacity: this.userOpacity }]}>
								<Animated.View style={[componentStyles.userInfoWrap, { transform: [{ scale: this.avatarScale }] }]}>
									<UserPhoto url={this.props.data.core.member.photo} size={80} />
									<Text style={componentStyles.usernameText}>{this.props.data.core.member.name}</Text>
									<Text style={componentStyles.groupText}>{this.props.data.core.member.group.name}</Text>
								</Animated.View>
								{Boolean(showFollowButton) && (
									<View style={[styles.mtWide, componentStyles.buttonBar]}>
										<Button
											filled
											rounded
											type="light"
											size="medium"
											title={this.props.data.core.member.follow.isFollowing ? Lang.get("unfollow") : Lang.get("follow")}
											onPress={this.toggleFollowModal}
											style={componentStyles.button}
										/>
									</View>
								)}
								<View style={[styles.mtWide, componentStyles.profileStats]}>
									<View style={[componentStyles.profileStatSection, componentStyles.profileStatSectionBorder]}>
										<Text style={componentStyles.profileStatCount}>{this.props.data.core.member.contentCount}</Text>
										<Text style={componentStyles.profileStatTitle}>{Lang.get("profile_content_count")}</Text>
									</View>
									{Boolean(this.props.site.settings.reputation_show_profile) && (
										<View style={[componentStyles.profileStatSection, componentStyles.profileStatSectionBorder]}>
											<Text style={componentStyles.profileStatCount}>{this.props.data.core.member.reputationCount}</Text>
											<Text style={componentStyles.profileStatTitle}>{Lang.get("profile_reputation")}</Text>
										</View>
									)}
									{Boolean(this.props.data.core.member.allowFollow) && (
										<View style={componentStyles.profileStatSection}>
											<Text style={componentStyles.profileStatCount}>{this.props.data.core.member.follow.followCount}</Text>
											<Text style={componentStyles.profileStatTitle}>{Lang.get("profile_followers")}</Text>
										</View>
									)}
								</View>
							</Animated.View>
						</Animated.View>
						<Tabs
							renderTabBar={this.renderTabBar}
							onChangeTab={({ i }) => {
								this.setState({
									tabHeight: this._heights[i],
									activeTab: i
								});
							}}
							tabBarUnderlineStyle={styleVars.tabBar.underline}
						>
							<ProfileTab tabIndex={0} heading={Lang.get("profile_overview")} active={this.state.activeTab == 0} minHeight={this.state.minHeight}>
								<SectionList
									scrollEnabled={false}
									renderItem={({ item }) => <ProfileField key={item.key} title={item.data.title} value={item.data.value} type={item.data.type} />}
									renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
									sections={this.getProfileFields()}
								/>
							</ProfileTab>
							<ProfileTab tabIndex={1} heading={Lang.get("profile_content")} active={this.state.activeTab == 1} minHeight={this.state.minHeight}>
								<ProfileContent showResults={this.state.activeTab == 1} member={this.props.data.core.member.id} />
							</ProfileTab>
							{additionalTabs.map((tab, idx) => (
								<ProfileTab key={tab.title} tabIndex={idx + 2} heading={tab.title} active={this.state.activeTab == idx + 2} minHeight={this.state.minHeight}>
									<RichTextContent style={componentStyles.editorField}>{tab.content}</RichTextContent>
								</ProfileTab>
							))}
							{Boolean(this.props.data.core.member.allowFollow) && (
								<ProfileTab
									key="followers"
									tabIndex={additionalTabs.length + 2}
									heading="Followers"
									active={this.state.activeTab == additionalTabs.length + 2}
									minHeight={this.state.minHeight}
								>
									<ProfileFollowers id={this.props.data.core.member.id} />
								</ProfileTab>
							)}
						</Tabs>
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
	userInfoWrap: {
		display: "flex",
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
	},
	editorField: {
		backgroundColor: "#fff",
		padding: styleVars.spacing.wide
	}
});

export default compose(
	graphql(ProfileQuery, {
		options: props => ({
			variables: {
				member: props.navigation.state.params.id
			}
		})
	}),
	connect(state => ({
		user: state.user,
		site: state.site
	})),
	withApollo
)(ProfileScreen);
