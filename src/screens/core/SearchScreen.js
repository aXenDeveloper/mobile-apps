import React, { Component } from "react";
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	TextInput,
	Image,
	SectionList,
	AsyncStorage,
	ActivityIndicator,
	TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import _ from "underscore";
import ScrollableTabView, {
	ScrollableTabBar
} from "react-native-scrollable-tab-view";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";

import Lang from "../../utils/Lang";
import CustomHeader from "../../ecosystems/CustomHeader";
import SectionHeader from "../../atoms/SectionHeader";
import MemberRow from "../../atoms/MemberRow";
import StreamCard from "../../ecosystems/StreamCard";
import StreamCardFragment from "../../ecosystems/StreamCard/StreamCardFragment";
import ContentRow from "../../ecosystems/ContentRow";
import styles, { styleVars } from "../../styles";

const OverviewSearchQuery = gql`
	query OverviewSearchQuery($term: String) {
		core {
			search {
				types {
					key
					lang
				}
			}
			content: search(term: $term, limit: 3) {
				count
				results {
					...on core_ContentSearchResult {
						...StreamCardFragment
					}
				}
			}
			members: search(term: $term, type: core_members, limit: 3) {
				count
				results {
					...on core_Member {
						id
						photo
						name
						group {
							name
						}
					}
				}
			}
		}
	}
	${StreamCardFragment}
`;

const SearchQuery = gql`
	query OverviewSearchQuery($term: String, $type: core_search_types_input) {
		core {
			search(term: $term, type: $type) {
				count
				results {
					...on core_Member {
						id
						photo
						name
						group {
							name
						}
					}
					...on core_ContentSearchResult {
						...StreamCardFragment
					}
				}
			}
		}
	}
	${StreamCardFragment}
`;

class SearchScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this._textInput = null;
		this.state = {
			// main search stuff
			searchTerm: '',
			loadingSearchResults: false,
			currentTab: '',
			overviewSearchResults: {},
			searchTabs: [],
			searchSections: {},
			searchResults: [],
			showingResults: false,
			textInputActive: false,

			// initial screen
			recentSearches: [],
			loadingRecentSearches: true,
			loadingTrendingSearches: true
		};
	}

	/**
	 * On mount, load our recent searches from storage then update state
	 *
	 * @return 	void
	 */
	async componentDidMount() {
		const recentSearchData = await AsyncStorage.getItem('@recentSearches');
		const recentSearches = [];

		if (recentSearchData !== null && _.isArray(recentSearchData)) {
			const timeNow = Date.now() / 1000;
			const cutoff = timeNow - 5184000; // 3 months

			recentSearchData.forEach(result => {
				if (result.time >= cutoff) {
					recentSearches.push(result.term);
				}
			});
		}

		this.setState({
			recentSearches,
			loadingRecentSearches: false
		});
	}

	/**
	 * Handle click on the Cancel link
	 *
	 * @return 	void
	 */
	goBack() {
		//this.props.navigation.goBack();
		this._textInput.clear();
		this._textInput.blur();
		this.setState({
			textInputActive: false,
			showingResults: false
		});
	}

	/**
	 * onFocus event handler
	 *
	 * @return 	void
	 */
	onFocusTextInput() {
		this.setState({
			textInputActive: true
		});
	}

	/**
	 * onBlur event handler
	 *
	 * @return 	void
	 */
	onBlurTextInput() {
		this.setState({
			textInputActive: false
		});
	}

	/**
	 * Event handler for submitting the search field. Sends the overview query.
	 *
	 * @return 	void
	 */
	async onSubmitTextInput() {
		this.setState({
			loadingSearchResults: true
		});

		try {
			const { data } = await this.props.client.query({
				query: OverviewSearchQuery,
				variables: {
					term: this.state.searchTerm
				}
			});

			const searchSections = {};
			data.core.search.types.forEach( type => {
				searchSections[ type.key ] = {
					key: type.key,
					lang: type.lang,
					status: null,
					data: []
				};
			});

			this.setState({
				currentTab: 'overview',
				overviewSearchResults: {
					content: data.core.content,
					members: data.core.members
				},
				showingResults: true,
				searchTabs: data.core.search.types,
				searchSections
			});
		} catch (err) {
			console.log( err );
		}

		this.setState({
			loadingSearchResults: false			
		});
	}

	/**
	 * Build the sectionlist for the search home screen
	 *
	 * @return 	Component
	 */
	getSearchHomeScreen() {
		const sectionData = [
			{
				title: "Recent Searches",
				key: "recent",
				data: this.state.recentSearches
			},
			/*{
				title: "Trending Searches",
				key: "trending",
				data: [
					"Fusce Ornare Purus",
					"Commodo Ipsum",
					"Tristique Nibh Quam Parturient",
					"Inceptos Nibh"
				]
			}*/
		];

		return (
			<SectionList
				renderItem={({ item }) => this.renderShortcutItem(item)}
				renderSectionFooter={({ section }) =>
					this.renderShortcutFooter(section)
				}
				renderSectionHeader={({ section }) => (
					<SectionHeader title={section.title} />
				)}
				sections={sectionData}
				keyExtractor={item => item}
			/>
		);
	}

	/**
	 * Render a footer component for the search home screen. Used to render
	 * Loading or None text in empty sections.
	 *
	 * @param 	object 		section 	Section data
	 * @return 	Component|null
	 */
	renderShortcutFooter(section) {
		if (section.data.length) {
			return null;
		}

		let text = `${Lang.get('loading')}...`;

		if( section.key === 'recent' && !this.state.loadingRecentSearches ){
			text = Lang.get('no_recent_searches');
		} else if( section.key === 'trending' && !this.state.loadingTrendingSearches ){
			text = Lang.get('no_trending_searches');
		}

		return (
			<ContentRow style={componentStyles.recentSearchRow}>
				<Text
					numberOfLines={1}
					style={[componentStyles.recentSearchRowText, styles.veryLightText]}
				>
					{text}
				</Text>
			</ContentRow>
		);
	}

	/**
	 * Event handler for tapping on a search shortcut row
	 *
	 * @return 	void
	 */
	recentSearchClick() {
		console.log("click search row");
	}

	/**
	 * Render a shortcut row
	 *
	 * @param 	object 		item 		Row item data
	 * @return 	Component
	 */
	renderShortcutItem(item) {
		return (
			<ContentRow
				style={componentStyles.recentSearchRow}
				onPress={this.recentSearchClick.bind(this)}
			>
				<Text
					numberOfLines={1}
					style={componentStyles.recentSearchRowText}
				>
					{item}
				</Text>
				<Image
					source={require("../../../resources/search.png")}
					style={componentStyles.recentSearchRowIcon}
					resizeMode="contain"
				/>
			</ContentRow>
		);
	}

	/**
	 * Render combined results for the overview tab
	 *
	 * @return 	Component
	 */
	renderOverviewTab() {
		const overviewData = [
			{
				title: 'Top Content',
				count: this.state.overviewSearchResults.content.count, 
				data: this.state.overviewSearchResults.content.results
			},
			{
				title: 'Top Members',
				count: this.state.overviewSearchResults.members.count,
				data: this.state.overviewSearchResults.members.results
			}
		];

		return (
			<SectionList
				renderItem={({ item }) => this.renderOverviewItem(item)}
				renderSectionFooter={({ section }) =>
					this.renderOverviewSectionFooter(section)
				}
				renderSectionHeader={({ section }) => (
					<SectionHeader title={section.title} />
				)}
				sections={overviewData}
				stickySectionHeadersEnabled={false}
				keyExtractor={item => item['__typename'] == 'core_Member' ? 'm' + item.id : 'c' + item.indexID}
			/>
		);
	}

	renderOverviewItem(item) {
		if( item['__typename'] == 'core_Member' ){
			return <MemberRow data={item} onPress={() => {
				this.props.navigation.navigate("Profile", {
					id: item.id,
					name: item.name,
					photo: item.photo
				});
			}} />;
		} else {
			return <StreamCard data={item} isSupported={true} />;
		}
	}

	renderOverviewSectionFooter(section) {
		if( section.data.length ){
			if( section.count > section.data.length ){
				return (
					<ContentRow
						style={componentStyles.seeAllRow}
						onPress={null}
					>
						<Text
							numberOfLines={1}
							style={componentStyles.seeAllRowText}
						>
							See All ({section.count})
						</Text>
					</ContentRow>
				);
			} 
			
			return null;
		}

		return <Text>Footer</Text>;
	}

	/**
	 * Event handler for changing a tab
	 *
	 * @return 	void
	 */
	onChangeTab(tab) {
		// Get tab
		const tabIndex = tab.i;

		// index 0 is the overview tab so we don't need to do anything
		if( tabIndex == 0 ){
			return;
		}

		const selectedTab = this.state.searchTabs[ tabIndex - 1 ];
	}

	/**
	 * Build the tab panels for our results screen
	 *
	 * @return 	Component
	 */
	getResultsViews() {
		return (
			<ScrollableTabView
				tabBarTextStyle={componentStyles.tabBarText}
				tabBarBackgroundColor="#fff"
				tabBarActiveTextColor="#2080A7"
				tabBarUnderlineStyle={componentStyles.activeTabUnderline}
				renderTabBar={() => <ScrollableTabBar />}
				initialPage={0}
				onChangeTab={(tab) => this.onChangeTab(tab)}
			>
				<View style={componentStyles.tab} tabLabel="OVERVIEW">
					{this.renderOverviewTab()}
				</View>
				{this.state.searchTabs.map( (type) => (
					<View style={componentStyles.tab} key={type.key} tabLabel={type.lang.toUpperCase()}>
						{this.getTabContents(type.key)}
					</View>
				))}
			</ScrollableTabView>
		);
	}

	/**
	 * build the contents of the specified tab, based on whatever we have in state for that key
	 *
	 * @return 	Component
	 */
	getTabContents(tab) {
		const tabData = this.state.searchSections[ tab ];

		if( tabData.status === null || tabData.status === 'loading' ){
			return <View style={componentStyles.tabNoContent}><ActivityIndicator size='large' /></View>;
		} else {

		}
	}

	render() {
		const searchBox = (
			<View style={componentStyles.searchWrap}>
				<View
					style={[
						componentStyles.searchBox,
						this.state.textInputActive
							? componentStyles.searchBoxActive
							: null
					]}
				>
					<Image
						source={require("../../../resources/search.png")}
						style={componentStyles.searchIcon}
						resizeMode="contain"
					/>
					<TextInput
						autoFocus
						autoCapitalize='none'
						autoCorrect={false}
						style={componentStyles.textInput}
						placeholderTextColor="rgba(255,255,255,0.6)"
						placeholder={Lang.get("search_site", {
							siteName: this.props.site.board_name
						})}
						returnKeyType="search"
						onFocus={() => this.onFocusTextInput()}
						onBlur={() => this.onBlurTextInput()}
						onChangeText={(searchTerm) => this.setState({searchTerm})}
						onSubmitEditing={() => this.onSubmitTextInput()}
						ref={ref => (this._textInput = ref)}
					/>
				</View>
				{(this.state.textInputActive || this.state.showingResults) && (
					<TouchableOpacity
						style={componentStyles.cancelLink}
						onPress={() => this.goBack()}
					>
						<Text style={componentStyles.cancelLinkText}>
							{Lang.get("cancel")}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);

		return (
			<View style={{ flex: 1 }}>
				<CustomHeader content={searchBox} />
				{this.state.showingResults
					? this.getResultsViews()
					: this.getSearchHomeScreen()}
			</View>
		);
	}
}

export default compose(
	connect(state => ({
		site: state.site
	})),
	withApollo
)(SearchScreen);

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
		alignItems: "center"
	},
	searchBoxActive: {
		backgroundColor: "rgba(0,0,0,0.3)"
	},
	textInput: {
		color: "#fff",
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
		fontWeight: "bold",
		fontSize: 13
	},
	activeTabUnderline: {
		backgroundColor: "#2080A7",
		height: 2
	},
	tab: {
		flex: 1
	},
	tabNoContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	recentSearchRow: {
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide,
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	recentSearchRowText: {
		fontSize: styleVars.fontSizes.content
	},
	recentSearchRowIcon: {
		tintColor: "rgba(0,0,0,0.6)",
		width: 15,
		height: 15
	},
	seeAllRow: {
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide
	},
	seeAllRowText: {
		textAlign: 'center',
		color: styleVars.primaryButton.mainColor,
		fontSize: styleVars.fontSizes.content,
		fontWeight: '500'
	}
});
