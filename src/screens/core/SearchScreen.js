import React, { Component } from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	Image,
	SectionList,
	TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import Lang from "../../utils/Lang";
import CustomHeader from "../../ecosystems/CustomHeader";
import SectionHeader from "../../atoms/SectionHeader";
import ContentRow from "../../ecosystems/ContentRow";
import styles, { styleVars } from "../../styles";

class SearchScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this._textInput = null;
		this.state = {
			textInputActive: false,
			showingResults: false
		};
	}

	goBack() {
		//this.props.navigation.goBack();
		this._textInput.clear();
		this._textInput.blur();
		this.setState({
			textInputActive: false,
			showingResults: false
		});
	}

	onFocusTextInput() {
		this.setState({
			textInputActive: true,
		});
	}

	onBlurTextInput() {
		this.setState({
			textInputActive: false
		});
	}

	onSubmitTextInput() {
		this.setState({
			showingResults: true
		});
	}

	getSearchBox() {
		return (
			<View style={componentStyles.searchWrap}>
				<View style={[ componentStyles.searchBox, this.state.textInputActive ? componentStyles.searchBoxActive : null ]}>
					<Image
						source={require("../../../resources/search.png")}
						style={componentStyles.searchIcon}
						resizeMode="contain"
					/>
					<TextInput
						autoFocus
						style={componentStyles.textInput}
						placeholderTextColor="rgba(255,255,255,0.6)"
						placeholder={Lang.get('search_site', { siteName: this.props.site.board_name })}
						returnKeyType='search'
						onFocus={() => this.onFocusTextInput()}
						onBlur={() => this.onBlurTextInput()}
						onSubmitEditing={() => this.onSubmitTextInput()}
						ref={ref => this._textInput = ref}
					/>
				</View>
				{( this.state.textInputActive || this.state.showingResults ) && 
					<TouchableOpacity style={componentStyles.cancelLink} onPress={() => this.goBack()}>
						<Text style={componentStyles.cancelLinkText}>{Lang.get('cancel')}</Text>
					</TouchableOpacity>}
			</View>
		);
	}

	getResultsViews() {
		return (
			<ScrollableTabView tabBarTextStyle={componentStyles.tabBarText} tabBarBackgroundColor='#fff' tabBarActiveTextColor='#2080A7' tabBarUnderlineStyle={componentStyles.activeTabUnderline} renderTabBar={() => <ScrollableTabBar />}>
				<View tabLabel='OVERVIEW'>
					<Text>Overview</Text>
				</View>
				<View tabLabel='TOPICS'>
					<Text>Topics</Text>
				</View>
				<View tabLabel='MEMBERS'>
					<Text>Members</Text>
				</View>
				<View tabLabel='FILES'>
					<Text>Files</Text>
				</View>
				<View tabLabel='IMAGES'>
					<Text>Images</Text>
				</View>
			</ScrollableTabView>
		);
	}

	getSearchHomeScreen() {
		const sectionData = [
			{
				title: "Recent Searches",
				data: [
					{text: 'Some search'},
					{text: 'Another search'},
					{text: 'This is another result'}
				]
			},
			{
				title: "Trending Searches",
				data: [
					{text: 'Fusce Ornare Purus'},
					{text: 'Commodo Ipsum'},
					{text: 'Tristique Nibh Quam Parturient'},
					{text: 'Inceptos Nibh'}
				]
			}
		];

		return (
			<SectionList
				renderItem={({ item }) => this.renderItem(item)}
				renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
				sections={sectionData}
				keyExtractor={item => item.text}
			/>
		);
	}

	recentSearchClick() {
		console.log("click search row");
	}

	renderItem(item) {
		return (
			<ContentRow style={componentStyles.recentSearchRow} onPress={this.recentSearchClick.bind(this)}>
				<Text numberOfLines={1} style={componentStyles.recentSearchRowText}>{item.text}</Text>
				<Image
					source={require("../../../resources/search.png")}
					style={componentStyles.recentSearchRowIcon}
					resizeMode="contain"
				/>
			</ContentRow>
		);
	}

	render() {
		return (
			<View>
				<CustomHeader content={this.getSearchBox()} />
				{this.state.showingResults ? this.getResultsViews() : this.getSearchHomeScreen()}
			</View>
		);
	}
}

export default connect(state => ({
	site: state.site
}))(SearchScreen);

const componentStyles = StyleSheet.create({
	searchWrap: {
		paddingTop: 32,
		paddingHorizontal: styleVars.spacing.tight,
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	searchBox: {
		backgroundColor: "rgba(255,255,255,0.1)",
		paddingVertical: styleVars.spacing.tight,
		paddingHorizontal: styleVars.spacing.tight,
		borderRadius: 5,
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	searchBoxActive: {
		backgroundColor: 'rgba(0,0,0,0.3)'
	},
	textInput: {
		color: '#fff',
		flex: 1
	},
	searchIcon: {
		width: 14,
		height: 14,
		tintColor: "rgba(255,255,255,0.6)",
		marginRight: styleVars.spacing.veryTight
	},
	cancelLink: {
		marginLeft: styleVars.spacing.standard
	},
	cancelLinkText: {
		color: "#fff",
		fontSize: styleVars.fontSizes.content
	},
	tabBarText: {
		fontWeight: 'bold',
		fontSize: 13
	},
	activeTabUnderline: {
		backgroundColor: '#2080A7',
		height: 2
	},
	recentSearchRow: {
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	recentSearchRowText: {
		fontSize: styleVars.fontSizes.content
	},
	recentSearchRowIcon: {
		tintColor: "rgba(0,0,0,0.6)",
		width: 15,
		height: 15
	}
});
