import React, { Component } from "react";
import { Text, Image, ScrollView, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import _ from "underscore";
import { connect } from "react-redux";

import NavigationService from "../../utils/NavigationService";
import Lang from "../../utils/Lang";
import GoToMulti from "../../atoms/GoToMulti";
import { Post } from "../../ecosystems/Post";
import LargeTitle from "../../atoms/LargeTitle";
import ErrorBox from "../../atoms/ErrorBox";
import StreamCard from "../../ecosystems/Stream";
import LoginRegisterPrompt from "../../ecosystems/LoginRegisterPrompt";
import { PlaceholderRepeater, PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import ContentCard from "../../ecosystems/ContentCard";
import getErrorMessage from "../../utils/getErrorMessage";
import styles, { styleVars } from "../../styles";

import { HomeSections } from "../../ecosystems/HomeSections";

/*
NOTE: In this component we don't use the HOC graphql(), instead manually calling
this.props.client.query on mount. This allows us to build a dynamic query based
on the homepage widgets that have been configured on the site.
*/

const HomeSectionsToShow = ["new_content", "active_users", "our_picks", "popular_contributors"];

class HomeScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "Invision Community",
			headerLeft: <GoToMulti />
		};
	};

	static CARD_WIDTH = 285;

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: false,
			data: null,
			navConfig: []
		};
	}

	componentDidMount() {
		this.startHomeQuery();
	}

	async startHomeQuery() {
		this.setState({
			loading: true,
			error: false
		});

		let queryFragments = [];
		let queryIncludes = [];

		// Dynamically build the fragments we'll need
		HomeSectionsToShow.forEach(section => {
			if (!_.isUndefined(HomeSections[section])) {
				queryFragments.push("..." + HomeSections[section].fragmentName);
				queryIncludes.push(HomeSections[section].fragment);
			}
		});

		const query = gql`
			query HomeQuery {
				core {
					${queryFragments.join("\n")}
				}
			}
			${gql(queryIncludes.join("\n"))}
		`;

		try {
			const { data } = await this.props.client.query({
				query,
				variables: {}
			});

			const navConfig = this.getNavConfig();

			this.setState({
				loading: false,
				data,
				navConfig
			});
		} catch (err) {
			console.log(err);

			this.setState({
				loading: false,
				error: true
			});
		}
	}

	/**
	 * Returns the login/register component if a guest
	 *
	 * @return 	Component|null
	 */
	getLoginRegPrompt() {
		if (this.props.auth.isAuthenticated) {
			return null;
		}

		return (
			<LoginRegisterPrompt
				closable
				register={this.props.site.settings.allow_reg !== "DISABLED"}
				registerUrl={this.props.site.settings.allow_reg_target || null}
				navigation={this.props.navigation}
				message={Lang.get(this.props.site.settings.allow_reg !== "DISABLED" ? "login_register_prompt" : "login_prompt", {
					siteName: this.props.site.settings.board_name
				})}
			/>
		);
	}

	/**
	 * Try refreshing the home screen
	 *
	 * @return 	void
	 */
	refreshAfterError() {
		this.startHomeQuery();
	}

	getNavConfig() {
		return [
			{
				key: "forums_all",
				title: "All Topics",
				icon: require("../../../resources/browse/forums_all.png"),
				handler: () => {
					console.log("all topics");
					this.props.navigation.navigate("FluidForum");
				}
			},
			{
				key: "forums_browse",
				title: "Forums",
				icon: require("../../../resources/browse/forums_browse.png"),
				handler: () => {
					console.log("navigate!");
					this.props.navigation.navigate("ForumIndex");
				}
			}
			/*{
				key: "gallery_all",
				title: "All Images",
				icon: require("../../../resources/browse/gallery_all.png"),
				handler: () => {
					console.log("albums");
				}
			},
			{
				key: "gallery_browse",
				title: "Browse By Category",
				icon: require("../../../resources/browse/gallery_browse.png"),
				handler: () => {
					console.log("albums");
				}
			},
			{
				key: "downloads_all",
				title: "All Files",
				icon: require("../../../resources/browse/gallery_all.png"),
				handler: () => {
					console.log("albums");
				}
			},
			{
				key: "downloads_browse",
				title: "Browse By Category",
				icon: require("../../../resources/browse/gallery_browse.png"),
				handler: () => {
					console.log("albums");
				}
			}*/
		];
	}

	renderNavItem(item) {
		return (
			<TouchableOpacity style={componentStyles.navItem} onPress={item.handler}>
				<React.Fragment>
					<Image source={item.icon} resizeMode="contain" style={componentStyles.navItemIcon} />
					<Text style={componentStyles.navItemText}>{item.title}</Text>
				</React.Fragment>
			</TouchableOpacity>
		);
	}

	render() {
		if (this.state.error) {
			return <ErrorBox message={Lang.get("home_view_error")} refresh={() => this.refreshAfterError()} />;
		} else {
			let navigation;

			if (this.state.navConfig.length) {
				navigation = (
					<FlatList
						renderItem={({ item }) => this.renderNavItem(item)}
						data={this.state.navConfig}
						keyExtractor={item => item.key}
						horizontal
						showsHorizontalScrollIndicator={false}
					/>
				);
			} else {
				navigation = (
					<PlaceholderContainer>
						<PlaceholderElement width={120} top={0} left={15} height={45} style={{ borderRadius: 45 }} />
						<PlaceholderElement width={120} top={0} left={145} height={45} style={{ borderRadius: 45 }} />
						<PlaceholderElement width={120} top={0} left={275} height={45} style={{ borderRadius: 45 }} />
					</PlaceholderContainer>
				);
			}

			return (
				<React.Fragment>
					<View style={componentStyles.navigator}>{navigation}</View>
					{this.getLoginRegPrompt()}
					<ScrollView style={componentStyles.browseWrapper}>
						{HomeSectionsToShow.map(section => {
							const SectionComponent = HomeSections[section].component;
							return (
								<React.Fragment key={section}>
									<LargeTitle icon={HomeSections[section].icon || null}>{Lang.get(section)}</LargeTitle>
									<SectionComponent loading={this.state.loading} data={this.state.data} cardWidth={HomeScreen.CARD_WIDTH} navigation={this.props.navigation} />
								</React.Fragment>
							);
						})}
					</ScrollView>
				</React.Fragment>
			);
		}
	}
}

export default connect(state => ({
	user: state.user,
	site: state.site,
	auth: state.auth
}))(withApollo(HomeScreen));

const componentStyles = StyleSheet.create({
	navigator: {
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
		paddingVertical: styleVars.spacing.standard,
		height: 70
	},
	navItem: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginLeft: styleVars.spacing.standard,
		backgroundColor: "#F5F5F5",
		paddingHorizontal: styleVars.spacing.wide,
		paddingVertical: styleVars.spacing.standard,
		borderRadius: 30
	},
	navItemText: {
		fontSize: styleVars.fontSizes.small,
		fontWeight: "500",
		lineHeight: 13,
		color: styleVars.tabActive
	},
	navItemIcon: {
		width: 18,
		height: 18,
		marginRight: styleVars.spacing.standard,
		tintColor: styleVars.tabActive
	}
});
