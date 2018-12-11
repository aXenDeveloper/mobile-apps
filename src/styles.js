import { StyleSheet } from "react-native";

import { isIphoneX } from "./utils/isIphoneX";

/* VARIABLES USED THROUGHOUT THE APP */
export const styleVars = {
	text: '#000000',
	lightText: '#657686',
	veryLightText: '#9ba3ab',
	reverseText: '#fff',
	accentColor: '#3370AA',
	altAccentColor: '#009BA2',
	popularColor: '#F58D23',
	appBackground: '#e6e8eb',
	tabActive: '#37454B',
	tabInactive: '#6e797e',
	citationTextStyle: `color: #222222; fontSize: 13; fontWeight: bold;`,
	placeholderColors: ['#ededed', '#f5f5f5'],
	touchColor: 'rgba(0,0,0,0.05)',
	touchOpacity: 0.7,
	toggleTint: '#1888a7',
	toggleTintInverse: '#a8dae8',
	primaryBrand: ['#3370AA', '#009BA2'],
	headerText: '#fff',
	primaryButton: {
		mainColor: '#3370AA',
		inverseColor: '#fff'
	},
	lightButton: {
		mainColor: '#ecf0f3',
		inverseColor: '#262b2f'
	},
	darkButton: {
		mainColor: '#1d2e3c',
		inverseColor: '#fff'
	},
	warningButton: {
		mainColor: '#cc1e3a',
		inverseColor: '#fff'
	},
	spacing: {
		veryTight: 4,
		tight: 8,
		standard: 12,
		wide: 16,
		veryWide: 20,
		extraWide: 24
	},
	fontSizes: {
		small: 13,
		standard: 14,
		content: 15,
		large: 17
	},
	fontFamily: 'System',
	lineHeight: {
		standard: 18
	},
	positive: '#43A047',
	negative: '#E53935',
	borderColors: {
		dark: '#CED6DB',
		medium: '#e1e7eb',
		light: '#f5f5f5',
	},
	checkmarkColor: '#3370AA',
	searchHighlight: '#fff4d4',
	searchHighlightText: '#000',
	tabBar: {
		active: '#3370AA',
		inactive: '#657686',
		underline: { 
			height: 2, 
			backgroundColor: '#3370AA'
		}
	},
	badgeBackground: '#ff3b2f',
	badgeText: '#fff',
	greys: {
		light: '#fafafa',
		medium: '#f5f5f5',
		darker: '#e0e0e0',
		placeholder: '#888888'
	}
};

/* REUSABLE STYLE CLASSES */
const styles = StyleSheet.create({
	header: {
		backgroundColor: "transparent",
		paddingTop: 25,
		shadowColor: "transparent",
		borderBottomWidth: 0
	},
	altHeader: {
		backgroundColor: "#252D31"
	},
	headerTitle: {
		color: "white",
		fontSize: 17,
		backgroundColor: "transparent",
		textAlign: "center",
		fontWeight: "500"
	},
	headerBack: {
		color: "white"
	},
	headerSubtitle: {
		color: "white",
		fontSize: 12,
		textAlign: "center",
		fontWeight: "300",
		opacity: 0.9
	},
	tabIcon: {
		width: 25,
		height: 25
	},
	userTabIcon: {
		borderRadius: 12.5
	},
	primaryTabBar: {
		/*backgroundColor: '#37454B',*/
		//backgroundColor: "#252D31"
		backgroundColor: '#fff',
		height: isIphoneX() ? 60 : 55,
		paddingBottom: styleVars.spacing.veryTight,
		paddingTop: styleVars.spacing.tight
	},
	swipeItemWrap: {
		backgroundColor: styleVars.accentColor,
	},
	swipeItem: {
		width: 75
	},
	swipeItemText: {
		color: "#fff",
		fontSize: styleVars.fontSizes.small
	},
	swipeItemIcon: {
		tintColor: '#fff',
		width: 24,
		height: 24,
		marginBottom: styleVars.spacing.veryTight
	},
	stackCardStyle: {
		backgroundColor: styleVars.appBackground
	},

	field: {
		backgroundColor: '#fff',
		paddingVertical: 15,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5e5'
	},
	fieldText: {
		fontSize: 16,
	},
	fieldTextPlaceholder: {
		color: '#C7C7CD'
	},
	textInput: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#d0d0d0',
		borderRadius: 3,
		paddingHorizontal: 7,
		paddingVertical: 7,
		marginBottom: 5
	},

	/* Flex styles */
	flexRow: {
		display: 'flex',
		flexDirection: 'row',
	},
	flexColumn: {
		display: 'flex',
	},
	flexAlignCenter: {
		alignItems: 'center'
	},
	flexAlignStart: {
		alignItems: 'flex-start'
	},
	flexAlignEnd: {
		alignItems: 'flex-end'
	},
	flexAlignContentCenter: {
		alignContent: 'center'
	},
	flexAlignStretch: {
		alignItems: 'stretch'
	},
	flexJustifyStart: {
		justifyContent: 'flex-start'
	},
	flexJustifyBetween: {
		justifyContent: 'space-between'
	},
	flexJustifyAround: {
		justifyContent: 'space-around'
	},
	flexJustifyCenter: {
		justifyContent: 'center'
	},
	flexJustifyEnd: {
		justifyContent: 'flex-end'
	},
	flexAlignSelfStart: {
		alignSelf: 'flex-start'
	},
	flexAlignSelfCenter: {
		alignSelf: 'center'
	},
	flexWrap: {
		flexWrap: 'wrap'
	},
	flexGrow: {
		flexGrow: 1
	},
	flexBasisZero: {
		flexBasis: 0
	},
	flexShrinkZero: {
		flexShrink: 0
	},
	flex: {
		flex: 1
	},

	/* Rows */
	row: {
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
	},

	/* Modal styles */
	modal: {
		backgroundColor: '#f3f3f3',
		borderRadius: 5
	},
	modalAlignBottom: {
		justifyContent: "flex-end",
		margin: 0,
		padding: 0
	},
	modalInner: {
		backgroundColor: "#fff",
		borderRadius: 6,
		paddingBottom: isIphoneX() ? 40 : 0
	},
	modalHorizontalPadding: {
		paddingHorizontal: 16
	},
	modalHeader: {
		paddingVertical: styleVars.spacing.wide,
		backgroundColor: styleVars.greys.medium,
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		borderBottomWidth: 1,
		borderBottomColor: styleVars.greys.darker
	},
	modalHeaderBar: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: styleVars.spacing.wide,
	},
	modalHeaderLink: {
		zIndex: 10
	},
	modalHeaderLinkText: {
		fontSize: styleVars.fontSizes.large,
		color: styleVars.accentColor
	},
	modalHeaderLinkTextDisabled: {
		color: styleVars.lightText,
		opacity: 0.5
	},
	modalTitle: {
		textAlign: 'center',
		fontWeight: '500',
		color: '#000',
		fontSize: styleVars.fontSizes.large,
		marginHorizontal: styleVars.spacing.wide,
	},
	modalTitleWithLinks: {
		position: 'absolute',
		left: 0,
		right: 0
	},
	modalHandle: {
		width: 40,
		height: 5,
		borderRadius: 5,
		backgroundColor: '#e0e0e0',
		position: 'absolute',
		top: -10,
		left: '50%',
		marginLeft: -20
	},
	modalClose: {
		width: 20,
		height: 20,
		position: 'absolute',
		top: -20,
		right: styleVars.spacing.standard,
		tintColor: styleVars.lightText
	},

	/* Toast */
	toastText: { 
		textAlign: 'center', 
		color: 'white' 
	},

	/* General purpose styles */
	unreadBackground: {
		backgroundColor: '#ffffff',
	},
	readBackground: {
		backgroundColor: '#ffffff', //'#f5f5f7'
	},
	lightBackground: {
		backgroundColor: styleVars.greys.light
	},
	text: {
		color: '#000'
	},
	textRead: {
		color: '#8e8e8e'
	},
	title: {
		color: '#000'
	},
	titleRead: {
		color: '#8e8e8e'
	},
	hidden: {
		display: 'none'
	},
	flexReset: { 
		flexBasis: 0, 
		flexGrow: 1 
	},

	/* Typography */
	itemTitle: {
		fontSize: styleVars.fontSizes.large,
		fontWeight: "600",
		color: '#171717',
		fontFamily: styleVars.fontFamily
	},
	smallItemTitle: {
		fontSize: styleVars.fontSizes.content,
		fontWeight: 'bold',
		color: '#171717',
		fontFamily: styleVars.fontFamily
	},
	highlightedText: {
		backgroundColor: styleVars.searchHighlight,
		color: styleVars.searchHighlightText
	},
	smallText: {
		fontSize: styleVars.fontSizes.small
	},
	standardText: {
		fontSize: styleVars.fontSizes.standard
	},
	contentText: {
		fontSize: styleVars.fontSizes.content
	},
	largeText: {
		fontSize: styleVars.fontSizes.large
	},
	lightText: {
		color: styleVars.lightText
	},
	veryLightText: {
		color: styleVars.veryLightText
	},
	reverseText: {
		color: styleVars.reverseText
	},
	accentText: {
		color: styleVars.accentColor
	},
	centerText: {
		textAlign: 'center'
	},
	italicText: {
		fontStyle: 'italic'
	},
	mediumText: {
		fontWeight: "600"
	},

	/* Spacing styles */
	mVeryTight: { margin: styleVars.spacing.veryTight },
	mTight: { margin: styleVars.spacing.tight },
	mStandard: { margin: styleVars.spacing.standard },
	mWide: { margin: styleVars.spacing.wide },
	mVeryWide: { margin: styleVars.spacing.veryWide },
	mExtraWide: { margin: styleVars.spacing.extraWide },
	//--
	mbVeryTight: { marginBottom: styleVars.spacing.veryTight },
	mbTight: { marginBottom: styleVars.spacing.tight },
	mbStandard: { marginBottom: styleVars.spacing.standard },
	mbWide: { marginBottom: styleVars.spacing.wide },
	mbVeryWide: { marginBottom: styleVars.spacing.veryWide },
	mbExtraWide: { marginBottom: styleVars.spacing.extraWide },
	//--
	mtVeryTight: { marginTop: styleVars.spacing.veryTight },
	mtTight: { marginTop: styleVars.spacing.tight },
	mtStandard: { marginTop: styleVars.spacing.standard },
	mtWide: { marginTop: styleVars.spacing.wide },
	mtVeryWide: { marginTop: styleVars.spacing.veryWide },
	mtExtraWide: { marginTop: styleVars.spacing.extraWide },
	//--
	mlVeryTight: { marginLeft: styleVars.spacing.veryTight },
	mlTight: { marginLeft: styleVars.spacing.tight },
	mlStandard: { marginLeft: styleVars.spacing.standard },
	mlWide: { marginLeft: styleVars.spacing.wide },
	mlVeryWide: { marginLeft: styleVars.spacing.veryWide },
	mlExtraWide: { marginLeft: styleVars.spacing.extraWide },
	//--
	mrVeryTight: { marginRight: styleVars.spacing.veryTight },
	mrTight: { marginRight: styleVars.spacing.tight },
	mrStandard: { marginRight: styleVars.spacing.standard },
	mrWide: { marginRight: styleVars.spacing.wide },
	mrVeryWide: { marginRight: styleVars.spacing.veryWide },
	mrExtraWide: { marginRight: styleVars.spacing.extraWide },
	//--
	mhVeryTight: { marginHorizontal: styleVars.spacing.veryTight },
	mhTight: { marginHorizontal: styleVars.spacing.tight },
	mhStandard: { marginHorizontal: styleVars.spacing.standard },
	mhWide: { marginHorizontal: styleVars.spacing.wide },
	mhVeryWide: { marginHorizontal: styleVars.spacing.veryWide },
	mhExtraWide: { marginHorizontal: styleVars.spacing.extraWide },
	//--
	mvVeryTight: { marginVertical: styleVars.spacing.veryTight },
	mvTight: { marginVertical: styleVars.spacing.tight },
	mvStandard: { marginVertical: styleVars.spacing.standard },
	mvWide: { marginVertical: styleVars.spacing.wide },
	mvVeryWide: { marginVertical: styleVars.spacing.veryWide },
	mvExtraWide: { marginVertical: styleVars.spacing.extraWide },
	//--
	pVeryTight: { padding: styleVars.spacing.veryTight },
	pTight: { padding: styleVars.spacing.tight },
	pStandard: { padding: styleVars.spacing.standard },
	pWide: { padding: styleVars.spacing.wide },
	pVeryWide: { padding: styleVars.spacing.veryWide },
	pExtraWide: { padding: styleVars.spacing.extraWide },
	//--
	pbVeryTight: { paddingBottom: styleVars.spacing.veryTight },
	pbTight: { paddingBottom: styleVars.spacing.tight },
	pbStandard: { paddingBottom: styleVars.spacing.standard },
	pbWide: { paddingBottom: styleVars.spacing.wide },
	pbVeryWide: { paddingBottom: styleVars.spacing.veryWide },
	pbExtraWide: { paddingBottom: styleVars.spacing.extraWide },
	//--
	ptVeryTight: { paddingTop: styleVars.spacing.veryTight },
	ptTight: { paddingTop: styleVars.spacing.tight },
	ptStandard: { paddingTop: styleVars.spacing.standard },
	ptWide: { paddingTop: styleVars.spacing.wide },
	ptVeryWide: { paddingTop: styleVars.spacing.veryWide },
	ptExtraWide: { paddingTop: styleVars.spacing.extraWide },
	//--
	plVeryTight: { paddingLeft: styleVars.spacing.veryTight },
	plTight: { paddingLeft: styleVars.spacing.tight },
	plStandard: { paddingLeft: styleVars.spacing.standard },
	plWide: { paddingLeft: styleVars.spacing.wide },
	plVeryWide: { paddingLeft: styleVars.spacing.veryWide },
	plExtraWide: { paddingLeft: styleVars.spacing.extraWide },
	//--
	prVeryTight: { paddingRight: styleVars.spacing.veryTight },
	prTight: { paddingRight: styleVars.spacing.tight },
	prStandard: { paddingRight: styleVars.spacing.standard },
	prWide: { paddingRight: styleVars.spacing.wide },
	prVeryWide: { paddingRight: styleVars.spacing.veryWide },
	prExtraWide: { paddingRight: styleVars.spacing.extraWide },
	//--
	phVeryTight: { paddingHorizontal: styleVars.spacing.veryTight },
	phTight: { paddingHorizontal: styleVars.spacing.tight },
	phStandard: { paddingHorizontal: styleVars.spacing.standard },
	phWide: { paddingHorizontal: styleVars.spacing.wide },
	phVeryWide: { paddingHorizontal: styleVars.spacing.veryWide },
	phExtraWide: { paddingHorizontal: styleVars.spacing.extraWide },
	//--
	pvVeryTight: { paddingVertical: styleVars.spacing.veryTight },
	pvTight: { paddingVertical: styleVars.spacing.tight },
	pvStandard: { paddingVertical: styleVars.spacing.standard },
	pvWide: { paddingVertical: styleVars.spacing.wide },
	pvVeryWide: { paddingVertical: styleVars.spacing.veryWide },
	pvExtraWide: { paddingVertical: styleVars.spacing.extraWide },

	/* HEADER STYLES */
	headerTitle: {
		color: 'white',
		fontSize: 17,
		fontWeight: "500",
		textAlign: 'center'
	},
	headerSubtitle: {
		color: 'white',
		fontSize: 12,
		textAlign: 'center',
		fontWeight: "300",
		opacity: 0.9
	}
});

export default styles;

/* STYLES FOR THE RICH TEXT COMPONENT */
export const richTextStyles = (dark) => ({
	defaultTextStyle: {
		color: dark ? '#fff' : '#222',
		fontSize: styleVars.fontSizes.content,
		lineHeight: 21
	},
	tagStyles: {
		'p': {
			marginBottom: 15
		}
	},
	classes: {
		'ipsQuote': {
			backgroundColor: '#fbfbfb', 
			borderWidth: 1, 
			borderStyle: 'solid', 
			borderColor: '#f3f3f3', 
			borderLeftWidth: 1, 
			borderLeftColor: '#222',
			marginBottom: 15
		},
		'ipsQuote_citation': {
			backgroundColor: '#f3f3f3',
			paddingVertical: 7,
			paddingHorizontal: 15
		},
		'ipsQuote_contents': {
			paddingHorizontal: 15,
			paddingVertical: 10
		}
	}
});

/* STYLES FOR BASIC TAB BARS */
export const tabStyles = {
	upperCaseLabel: true,
	showIcon: false,
	activeTintColor: "#2080A7",
	inactiveTintColor: "#888",
	iconStyle: {
		height: 0,
		width: 0,
		padding: 0
	},
	labelStyle: {
		fontSize: 13,
		fontWeight: "500",
		padding: 0,
		margin: 0
	},
	style: {
		padding: 6,
		margin: 0,
		display: "flex",
		justifyContent: "center",
		backgroundColor: '#fff'
	},
	tabStyle: {
		display: "flex",
		justifyContent: "center",
		backgroundColor: '#fff'
	},
	indicatorStyle: {
		backgroundColor: '#2080A7'
	}
};
