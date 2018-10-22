import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet, TextInput, Image, SectionList, AsyncStorage, ActivityIndicator, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";
import ScrollableTabView, { ScrollableTabBar } from "react-native-scrollable-tab-view";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { ScrollableTab, Tab, TabHeading, Tabs } from "native-base";

import Lang from "../../utils/Lang";
import CustomHeader from "../../ecosystems/CustomHeader";
import { PlaceholderElement, PlaceholderContainer, PlaceholderRepeater } from "../../ecosystems/Placeholder";
import SectionHeader from "../../atoms/SectionHeader";
import MemberRow from "../../ecosystems/MemberRow";
import ErrorBox from "../../atoms/ErrorBox";
import ContentRow from "../../ecosystems/ContentRow";
import CustomTab from "../../atoms/CustomTab";
import { SearchContentPanel, SearchMemberPanel, SearchResultFragment, SearchResult } from "../../ecosystems/Search";
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
			content: search(term: $term, limit: 3, orderBy: relevancy) {
				count
				results {
					... on core_ContentSearchResult {
						...SearchResultFragment
					}
				}
			}
			members: search(term: $term, type: core_members, limit: 3) {
				count
				results {
					... on core_Member {
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
	${SearchResultFragment}
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
			searchTerm: "",
			loadingSearchResults: false,
			currentTab: "",
			overviewSearchResults: {},
			noResults: false,
			searchSections: {},
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
		const recentSearchData = await AsyncStorage.getItem("@recentSearches");
		const recentSearches = this.transformRecentSearchData(recentSearchData);

		this.setState({
			recentSearches,
			loadingRecentSearches: false
		});
	}

	/**
	 * Takes raw recent search data  (e.g. from AsyncStorage) and returns a simple list of terms
	 *
	 * @return 	array
	 */
	transformRecentSearchData(recentSearchData) {
		const recentSearches = [];

		if (recentSearchData !== null) {
			const searchData = JSON.parse(recentSearchData);
			const timeNow = Date.now() / 1000;
			const cutoff = timeNow - 5184000; // 3 months

			searchData.forEach(result => {
				if (result.time >= cutoff) {
					recentSearches.push(result.term);
				}
			});
		}

		return recentSearches;
	}

	/**
	 * Handle click on the Cancel link
	 *
	 * @return 	void
	 */
	goBack = () => {
		//this.props.navigation.goBack();
		this._textInput.blur();
		this.setState({
			searchTerm: "",
			textInputActive: false,
			showingResults: false
		});
	};

	/**
	 * onFocus event handler
	 *
	 * @return 	void
	 */
	onFocusTextInput = () => {
		this.setState({
			textInputActive: true,
			showingResults: false
		});
	};

	/**
	 * onBlur event handler
	 *
	 * @return 	void
	 */
	onBlurTextInput = () => {
		this.setState({
			textInputActive: false
		});
	};

	/**
	 * Event handler for submitting the search field. Sends the overview query.
	 *
	 * @return 	void
	 */
	onSubmitTextInput = async () => {
		this.setState({
			loadingSearchResults: true
		});

		try {
			const { data } = await this.props.client.query({
				query: OverviewSearchQuery,
				variables: {
					term: this.state.searchTerm
				},
				fetchPolicy: "no-cache"
			});

			// Add the All Content tab to the start
			const searchSections = [
				{
					key: "overview",
					index: 0,
					lang: Lang.get("overview"),
					data: []
				},
				{
					key: "all",
					index: 1,
					lang: Lang.get("content"),
					data: []
				},
				...data.core.search.types.map((type, index) => ({
					key: type.key,
					index: index + 2, // we hardcoded the first two items, hence 2 here
					lang: type.lang,
					data: []
				}))
			];

			const recentSearches = await this.addToRecentSearches(this.state.searchTerm);

			this.setState({
				currentTab: "overview",
				noResults: !data.core.content.results.length && !data.core.members.results.length,
				overviewSearchResults: {
					content: data.core.content,
					members: data.core.members
				},
				showingResults: true,
				searchSections,
				recentSearches
			});
		} catch (err) {
			console.log(err);
		}

		this.setState({
			loadingSearchResults: false
		});
	};

	/**
	 * Add a new term to the recent searches list, tidying it up and removing dupes too
	 *
	 * @param 	string 		term 	The term to add to the recent search list
	 * @return 	void
	 */
	async addToRecentSearches(term) {
		let recentSearchData = await AsyncStorage.getItem("@recentSearches");

		if (recentSearchData === null) {
			recentSearchData = [];
		} else {
			recentSearchData = JSON.parse(recentSearchData);
		}

		// First, add our new search to the top of the list
		recentSearchData.unshift({
			term: term,
			time: Date.now()
		});

		// Now remove any dupes
		recentSearchData = _.uniq(recentSearchData, false, data => data.term);

		// Now check the length
		if (recentSearchData.length > 5) {
			recentSearchData = recentSearchData.slice(0, 4);
		}

		// AsyncStorage requires a string
		recentSearchData = JSON.stringify(recentSearchData);

		// Store it back in storage
		await AsyncStorage.setItem("@recentSearches", recentSearchData);

		// Now transform it and return
		return this.transformRecentSearchData(recentSearchData);
	}

	/**
	 * Build the sectionlist for the search home screen
	 *
	 * @return 	Component
	 */
	getSearchHomeScreen() {
		const sectionData = [
			{
				title: Lang.get("recent_searches"),
				key: "recent",
				data: this.state.recentSearches
			}
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
				renderSectionFooter={({ section }) => this.renderShortcutFooter(section)}
				renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
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

		let text = `${Lang.get("loading")}...`;

		if (section.key === "recent" && !this.state.loadingRecentSearches) {
			text = Lang.get("no_recent_searches");
		} else if (section.key === "trending" && !this.state.loadingTrendingSearches) {
			text = Lang.get("no_trending_searches");
		}

		return (
			<ContentRow style={componentStyles.leftAlign}>
				<Text numberOfLines={1} style={[componentStyles.leftAlignText, styles.veryLightText]}>
					{text}
				</Text>
			</ContentRow>
		);
	}

	/**
	 * Event handler for tapping on a search shortcut row
	 *
	 * @param 	string 		term 	The search term tapped
	 * @return 	void
	 */
	recentSearchClick(term) {
		// Since search relies on the searchterm being in state, we need to
		// run the search as a callback in setState
		this.setState(
			{
				searchTerm: term
			},
			() => {
				this.onSubmitTextInput();
			}
		);
	}

	/**
	 * Render a shortcut row
	 *
	 * @param 	object 		item 		Row item data
	 * @return 	Component
	 */
	renderShortcutItem(item) {
		return (
			<ContentRow style={componentStyles.leftAlign} onPress={() => this.recentSearchClick(item)}>
				<Text numberOfLines={1} style={componentStyles.leftAlignText}>
					{item}
				</Text>
				<Image source={require("../../../resources/search.png")} style={componentStyles.leftAlignIcon} resizeMode="contain" />
			</ContentRow>
		);
	}

	/**
	 * Render combined results for the overview tab
	 *
	 * @return 	Component
	 */
	renderOverviewTab() {
		const overviewData = [];

		if (this.state.overviewSearchResults.content.results.length) {
			overviewData.push({
				title: Lang.get("top_content"),
				key: "all",
				count: this.state.overviewSearchResults.content.count,
				data: this.state.overviewSearchResults.content.results
			});
		}

		if (this.state.overviewSearchResults.members.results.length) {
			overviewData.push({
				title: Lang.get("top_members"),
				key: "core_members",
				count: this.state.overviewSearchResults.members.count,
				data: this.state.overviewSearchResults.members.results
			});
		}

		return (
			<SectionList
				renderItem={({ item }) => this.renderOverviewItem(item)}
				renderSectionFooter={({ section }) => this.renderOverviewSectionFooter(section)}
				renderSectionHeader={({ section }) => section.data.length && <SectionHeader title={section.title} />}
				sections={overviewData}
				stickySectionHeadersEnabled={false}
				keyExtractor={item => (item["__typename"] == "core_Member" ? "m" + item.id : "c" + item.indexID)}
				ListEmptyComponent={() => <ErrorBox message={Lang.get("no_results")} showIcon={false} />}
			/>
		);
	}

	/**
	 * Render a row on the Overview search screen - either a member or a stream card
	 *
	 * @param 	object 		item 		Object of item data from search
	 * @return 	Component
	 */
	renderOverviewItem(item) {
		if (item["__typename"] == "core_Member") {
			return <MemberRow id={parseInt(item.id)} name={item.name} photo={item.photo} groupName={item.group.name} />;
		} else {
			return <SearchResult data={item} term={this.state.searchTerm} />;
		}
	}

	/**
	 * Render a footer for the overview search screen sections. Shows a See All link
	 * if there are additional results
	 *
	 * @param 	object 		section 	Object containing section data
	 * @return 	Component|null
	 */
	renderOverviewSectionFooter(section) {
		if (section.data.length) {
			if (section.count > section.data.length) {
				return (
					<ContentRow
						style={componentStyles.seeAllRow}
						onPress={() => {
							this.onChangeTab({ i: _.find( this.state.searchSections, (s) => s.key == section.key )['index'] });
						}}
					>
						<Text numberOfLines={1} style={componentStyles.seeAllRowText}>
							{Lang.get("see_all")} ({section.count})
						</Text>
					</ContentRow>
				);
			}
		}

		return null;
	}

	/**
	 * Event handler for changing a tab
	 *
	 * @return 	void
	 */
	onChangeTab = ({ i }) => {
		// index 0 is the overview tab so we don't need to do anything
		if (i == 0 || i == null) {
			this.setState({
				currentTab: "overview",
			});
			return;
		}

		this.setState({
			currentTab: this.state.searchSections[i].key
		});
	};

	/**
	 * Build the tab panels for our results screen
	 *
	 * @return 	Component
	 */
	getResultsViews() {
		let currentTab = null;

		if( this.state.currentTab ){
			currentTab = _.find( this.state.searchSections, (s) => s.key == this.state.currentTab )['index'];
		}

		return (
			<React.Fragment>
				<Tabs
					renderTabBar={props => (
						<ScrollableTab
							{...props}
							renderTab={(name, page, active, onPress, onLayout) => (
								<CustomTab key={name} name={name} page={page} active={active} onPress={onPress} onLayout={onLayout} />
							)}
						/>
					)}
					page={currentTab}
					tabBarUnderlineStyle={styleVars.tabBar.underline}
					onChangeTab={this.onChangeTab}
				>
					{this.state.searchSections.map(section => {
						if( section.key == 'overview' ){
							return (
								<Tab style={componentStyles.tab} key='overview' heading={Lang.get("overview")}>
									{this.renderOverviewTab()}
								</Tab>
							);
						} else if( !this.state.noResults ) {
							const PanelComponent = section.key === "core_members" ? SearchMemberPanel : SearchContentPanel;
							const showResults = this.state.currentTab == section.key;

							return (
								<Tab style={componentStyles.tab} key={section.key} heading={section.lang}>
									<PanelComponent
										type={section.key}
										typeName={section.lang}
										term={this.state.searchTerm}
										showResults={showResults}
									/>
								</Tab>
							);
						}
					})}
				</Tabs>
			</React.Fragment>
		);
	}

	/**
	 * Returns the placeholder elements for the overview screen
	 *
	 * @return 	Component
	 */
	getResultsPlaceholder() {
		return (
			<View style={{ flex: 1 }}>
				<PlaceholderContainer height={48} style={componentStyles.loadingTabBar}>
					<PlaceholderElement width={70} height={14} top={17} left={13} />
					<PlaceholderElement width={80} height={14} top={17} left={113} />
					<PlaceholderElement width={90} height={14} top={17} left={225} />
					<PlaceholderElement width={70} height={14} top={17} left={345} />
				</PlaceholderContainer>
				<PlaceholderRepeater repeat={2}>
					<SearchResult loading={true} />
				</PlaceholderRepeater>
				<PlaceholderRepeater repeat={3}>
					<MemberRow loading={true} />
				</PlaceholderRepeater>
			</View>
		);
	}

	render() {
		const searchBox = (
			<View style={componentStyles.searchWrap}>
				<View style={[componentStyles.searchBox, this.state.textInputActive ? componentStyles.searchBoxActive : null]}>
					<Image source={require("../../../resources/search.png")} style={componentStyles.searchIcon} resizeMode="contain" />
					<TextInput
						autoFocus
						autoCapitalize="none"
						autoCorrect={false}
						style={componentStyles.textInput}
						placeholderTextColor="rgba(255,255,255,0.6)"
						placeholder={Lang.get("search_site", {
							siteName: this.props.site.board_name
						})}
						returnKeyType="search"
						onFocus={this.onFocusTextInput}
						onBlur={this.onBlurTextInput}
						onChangeText={searchTerm => this.setState({ searchTerm })}
						onSubmitEditing={this.onSubmitTextInput}
						ref={ref => (this._textInput = ref)}
						value={this.state.searchTerm}
					/>
				</View>
				{(this.state.textInputActive || this.state.showingResults) && (
					<TouchableOpacity style={componentStyles.cancelLink} onPress={this.goBack}>
						<Text style={componentStyles.cancelLinkText}>{Lang.get("cancel")}</Text>
					</TouchableOpacity>
				)}
			</View>
		);

		let content;
		if (this.state.loadingSearchResults) {
			content = this.getResultsPlaceholder();
		} else if (this.state.showingResults) {
			content = this.getResultsViews();
		} else {
			content = this.getSearchHomeScreen();
		}

		return (
			<View style={{ flex: 1 }}>
				<CustomHeader content={searchBox} />
				{content}
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
		paddingHorizontal: styleVars.spacing.tight,
		paddingBottom: styleVars.spacing.tight,
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
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
		backgroundColor: "rgba(0,0,0,0.2)"
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
		flex: 1,
		backgroundColor: styleVars.appBackground
	},
	tabNoContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	leftAlign: {
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide,
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	leftAlignText: {
		fontSize: styleVars.fontSizes.content
	},
	leftAlignIcon: {
		tintColor: "rgba(0,0,0,0.6)",
		width: 15,
		height: 15
	},
	seeAllRow: {
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide
	},
	seeAllRowText: {
		textAlign: "center",
		color: styleVars.primaryButton.mainColor,
		fontSize: styleVars.fontSizes.content,
		fontWeight: "500"
	},
	loadingTabBar: {
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#cccccc"
	}
});
