import React, { Component } from "react";
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";

import Lang from "../../utils/Lang";
import SectionHeader from "../../atoms/SectionHeader";
import styles, { styleVars } from "../../styles";

export default class BrowseCommunityScreen extends Component {
	static navigationOptions = {
		title: "Search"
	};

	renderItem(item) {
		return (
			<View style={componentStyles.mainBox} key={item.title}>
				<View style={componentStyles.mainBoxTitle}>
					<Text style={componentStyles.appTitle}>{item.title}</Text>
					<Text style={componentStyles.appStat}>{item.count}</Text>
				</View>
				<View style={componentStyles.navItems}>
					{item.data.map(subItem => (
						<TouchableOpacity onPress={() => subItem.handler()} style={componentStyles.navItem} key={subItem.title}>
							<React.Fragment>
								<Image source={subItem.icon} resizeMode="contain" style={[componentStyles.navItemIcon]} />
								<Text style={[componentStyles.navItemTitle]} numberOfLines={1}>
									{subItem.title}
								</Text>
							</React.Fragment>
						</TouchableOpacity>
					))}
				</View>
			</View>
		);
	}

	render() {
		const nav = [
			{
				title: "Forums",
				count: "1234 topics",
				data: [
					{
						title: "All Discussions",
						//icon: require('../../../resources/browse/forums_all.png'),
						handler: () => {
							console.log("all topics");
						}
					},
					{
						title: "Browse By Forum",
						//icon: require('../../../resources/browse/forums_browse.png'),
						handler: () => {
							console.log("navigate!");
							this.props.navigation.navigate("ForumIndex");
						}
					}
				]
			},
			{
				title: "Gallery",
				count: "1234 images",
				data: [
					{
						title: "All Images",
						//icon: require('../../../resources/browse/gallery_all.png'),
						handler: () => {
							console.log("albums");
						}
					},
					{
						title: "Browse By Category",
						//icon: require('../../../resources/browse/gallery_browse.png'),
						handler: () => {
							console.log("albums");
						}
					}
				]
			},
			{
				title: "Marketplace",
				count: "1234 files",
				data: [
					{
						title: "All Files",
						//icon: require('../../../resources/browse/gallery_all.png'),
						handler: () => {
							console.log("albums");
						}
					},
					{
						title: "Browse By Category",
						//icon: require('../../../resources/browse/gallery_browse.png'),
						handler: () => {
							console.log("albums");
						}
					}
				]
			}
		];

		return (
			<View style={componentStyles.wrapper}>
				<FlatList renderItem={({ item }) => this.renderItem(item)} data={nav} keyExtractor={item => item.title} />
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	mainBox: {
		backgroundColor: "#fff",
		borderRadius: 5,
		paddingHorizontal: styleVars.spacing.wide,
		paddingBottom: styleVars.spacing.wide,
		paddingTop: styleVars.spacing.standard,
		marginTop: styleVars.spacing.wide,
		marginHorizontal: styleVars.spacing.wide,
		shadowColor: "rgba(0,0,0,0.05)",
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 1,
		shadowRadius: 12
	},
	mainBoxTitle: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	appStat: {
		color: styleVars.lightText,
		fontSize: styleVars.fontSizes.standard
	},
	appTitle: {
		fontWeight: "bold",
		fontSize: 22,
		color: "#000"
	},
	navItems: {
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		marginLeft: styleVars.spacing.tight * -1,
		marginRight: styleVars.spacing.tight * -1,
		marginTop: styleVars.spacing.standard
	},
	navItem: {
		flexBasis: 0,
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "#fafafa",
		borderRadius: 4,
		paddingHorizontal: styleVars.spacing.standard,
		paddingVertical: styleVars.spacing.standard,
		marginHorizontal: styleVars.spacing.tight
	},
	navItemTitle: {
		fontSize: 12,
		textAlign: "center",
		fontWeight: "500"
	},
	navItemIcon: {
		width: 30,
		height: 30,
		marginBottom: styleVars.spacing.standard,
		tintColor: styleVars.tabActive
	}
});
