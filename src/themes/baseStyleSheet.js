import { StyleSheet } from "react-native";
import { isIphoneX } from "../utils/isIphoneX";
import { transparentize } from "polished";

const baseStylesheet = (styleVars, darkMode) => ({
	header: {
		backgroundColor: "transparent",
		paddingTop: 25,
		shadowColor: "transparent",
		borderBottomWidth: 0,
		elevation: 0
	},
	altHeader: {
		backgroundColor: "#252D31"
	},
	headerTitle: {
		color: "white",
		fontSize: 17,
		backgroundColor: "transparent"
	},
	headerIcon: {
		tintColor: "white"
	},
	headerBack: {
		color: "white"
	},
	headerSubtitle: {
		color: "white",
		fontSize: 12,
		//textAlign: "center",
		fontWeight: "300",
		opacity: 0.9
	},
	primaryTabBar: {
		backgroundColor: "#fff",
		height: isIphoneX() ? 55 : 58,
		paddingBottom: styleVars.spacing.tight,
		paddingTop: styleVars.spacing.tight
	},
	userTabIcon: {
		borderRadius: 12.5
	},
	swipeItemWrap: {
		backgroundColor: styleVars.accentColor
	},
	swipeItem: {
		width: 75
	},
	swipeItemText: {
		color: "#fff",
		fontSize: styleVars.fontSizes.small
	},
	swipeItemIcon: {
		tintColor: "#fff",
		width: 24,
		height: 24,
		marginBottom: styleVars.spacing.veryTight
	},
	stackCardStyle: {
		backgroundColor: styleVars.appBackground
	},

	field: {
		backgroundColor: "#fff",
		paddingVertical: 15,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e5e5"
	},
	fieldText: {
		fontSize: 16
	},
	fieldTextPlaceholder: {
		color: "#C7C7CD"
	},
	textInput: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#d0d0d0",
		borderRadius: 3,
		paddingHorizontal: 7,
		paddingVertical: 7,
		marginBottom: 5
	},

	/* Flex styles */
	flexRow: {
		display: "flex",
		flexDirection: "row"
	},
	flexColumn: {
		display: "flex"
	},
	flexAlignCenter: {
		alignItems: "center"
	},
	flexAlignStart: {
		alignItems: "flex-start"
	},
	flexAlignEnd: {
		alignItems: "flex-end"
	},
	flexAlignContentCenter: {
		alignContent: "center"
	},
	flexAlignStretch: {
		alignItems: "stretch"
	},
	flexJustifyStart: {
		justifyContent: "flex-start"
	},
	flexJustifyBetween: {
		justifyContent: "space-between"
	},
	flexJustifyAround: {
		justifyContent: "space-around"
	},
	flexJustifyCenter: {
		justifyContent: "center"
	},
	flexJustifyEnd: {
		justifyContent: "flex-end"
	},
	flexAlignSelfStart: {
		alignSelf: "flex-start"
	},
	flexAlignSelfCenter: {
		alignSelf: "center"
	},
	flexWrap: {
		flexWrap: "wrap"
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
	listBackground: {
		backgroundColor: "#fff"
	},
	row: {
		backgroundColor: "#fff"
	},
	rowSeparator: {
		borderBottomWidth: 1,
		borderBottomColor: styleVars.borderColors.light,
		marginLeft: styleVars.spacing.wide
	},
	rowsWrap: {
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderTopColor: transparentize(0.6, styleVars.greys.darker),
		borderBottomColor: transparentize(0.6, styleVars.greys.darker)
	},

	/* Modal styles */
	modal: {
		backgroundColor: styleVars.greys.medium,
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
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: styleVars.spacing.wide
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
		textAlign: "center",
		fontWeight: "500",
		color: "#000",
		fontSize: styleVars.fontSizes.large,
		marginHorizontal: styleVars.spacing.wide
	},
	modalTitleWithLinks: {
		position: "absolute",
		left: 0,
		right: 0
	},
	modalHandle: {
		width: 40,
		height: 5,
		borderRadius: 5,
		backgroundColor: "#e0e0e0",
		position: "absolute",
		top: -10,
		left: "50%",
		marginLeft: -20
	},
	modalClose: {
		width: 20,
		height: 20,
		position: "absolute",
		top: -20,
		right: styleVars.spacing.standard,
		tintColor: styleVars.lightText
	},

	/* Toast */
	toastText: {
		textAlign: "center",
		color: "white"
	},

	/* Submit bar */
	bottomSubmitBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderTopColor: styleVars.borderColors.medium,
		paddingVertical: styleVars.spacing.wide,
		paddingHorizontal: styleVars.spacing.wide,
		...(isIphoneX() ? { paddingBottom: styleVars.spacing.extraWide + styleVars.spacing.wide } : {})
	},

	/* Tab bars */
	tabBar: {
		backgroundColor: "#fff"
	},
	tabBarIndicator: {
		backgroundColor: styleVars.accentColor
	},
	tabBarLabelStyle: {
		fontWeight: "500"
	},

	/* General purpose styles */
	unreadBackground: {
		backgroundColor: "#ffffff"
	},
	readBackground: {
		backgroundColor: "#ffffff" //'#f5f5f7'
	},
	lightBackground: {
		backgroundColor: styleVars.greys.light
	},
	moderatedBackground: {
		backgroundColor: styleVars.moderatedBackground.light
	},
	moderatedText: {
		color: styleVars.moderatedText.text
	},
	moderatedLightText: {
		color: styleVars.moderatedText.light
	},
	moderatedTitle: {
		color: styleVars.moderatedText.title
	},
	text: {
		color: styleVars.text
	},
	textRead: {
		color: "#585858"
	},
	title: {
		color: "#000"
	},
	titleRead: {
		color: "#585858"
	},
	hidden: {
		display: "none"
	},
	flexReset: {
		flexBasis: 0,
		flexGrow: 1
	},
	absoluteFill: {
		...StyleSheet.absoluteFillObject
	},

	/* Typography */
	largeTitle: {
		fontSize: 26,
		color: "#141823"
	},
	contentTitle: {
		fontSize: styleVars.fontSizes.extraLarge,
		fontWeight: "600",
		color: "#07080b",
		fontFamily: styleVars.fontFamily
	},
	itemTitle: {
		fontSize: styleVars.fontSizes.large,
		fontWeight: "600",
		color: "#141823",
		fontFamily: styleVars.fontFamily
	},
	smallItemTitle: {
		fontSize: styleVars.fontSizes.content,
		fontWeight: "bold",
		color: "#141823",
		fontFamily: styleVars.fontFamily
	},
	highlightedText: {
		backgroundColor: styleVars.searchHighlight,
		color: styleVars.searchHighlightText
	},
	tinyText: {
		fontSize: styleVars.fontSizes.tiny
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
	extraLargeText: {
		fontSize: styleVars.fontSizes.extraLarge
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
	standardLineHeight: {
		lineHeight: styleVars.lineHeight.standard
	},
	centerText: {
		textAlign: "center"
	},
	italicText: {
		fontStyle: "italic"
	},
	mediumText: {
		fontWeight: "600"
	},
	positiveText: {
		color: styleVars.positive
	},
	negativeText: {
		color: styleVars.negative
	},

	/* Border styles */
	bBorder: { borderBottomWidth: 1 },
	tBorder: { borderTopWidth: 1 },
	lBorder: { borderLeftWidth: 1 },
	rBorder: { borderRightWidth: 1 },
	hBorder: { borderLeftWidth: 1, borderRightWidth: 1 },
	vBorder: { borderTopWidth: 1, borderBottomWidth: 1 },

	lightBorder: { borderColor: styleVars.borderColors.light },
	mediumBorder: { borderColor: styleVars.borderColors.medium },
	darkBorder: { borderColor: styleVars.borderColors.dark },

	/* Image styles */
	tinyImage: {
		width: 14,
		height: 14
	},
	smallImage: {
		width: 20,
		height: 20
	},
	lightImage: {
		tintColor: styleVars.lightText
	},
	veryLightImage: {
		tintColor: styleVars.veryLightText
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
	pvExtraWide: { paddingVertical: styleVars.spacing.extraWide }
});

export default baseStylesheet;
