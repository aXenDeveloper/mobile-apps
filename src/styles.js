import { StyleSheet } from "react-native";

export const styleVars = {
	appBackground: '#eeeff1',
	tabActive: '#37454B',
	tabInactive: '#6e797e',
	citationTextStyle: `color: #222222; fontSize: 13; fontWeight: bold;`,
	placeholderColors: ['#ededed', '#f5f5f5']
};

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
		backgroundColor: '#fff'
	},
	markSwipeItem: {
		backgroundColor: "#009BA2"
	},
	rightSwipeItem: {
		flex: 1,
		justifyContent: "center",
		paddingLeft: 20
	},
	swipeItemText: {
		color: "white"
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

	/* Modal styles */
	modal: {
		backgroundColor: '#f3f3f3',
		borderRadius: 5
	},
	modalHorizontalPadding: {
		paddingHorizontal: 16
	},
	modalHeader: {
		marginTop: 16,
		marginBottom: 16
	},
	modalTitle: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#000',
		fontSize: 17
	},


	/* General purpose styles */
	unreadBackground: {
		backgroundColor: '#ffffff',
	},
	readBackground: {
		backgroundColor: '#ffffff', //'#f5f5f7'
	},
	smallText: {
		fontSize: 13
	},
	lightText: {
		color: '#8e8e8e'
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
	}
});

export default styles;

export const richTextStyles = {
	defaultTextStyle: {
		color: '#222',
		//fontSize: 15,
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
			borderLeftWidth: 3, 
			borderLeftColor: '#222'
		},
		'ipsQuote_citation': {
			backgroundColor: '#f3f3f3',
			paddingVertical: 5,
			paddingHorizontal: 15
		},
		'ipsQuote_contents': {
			padding: 15
		}
	}
};
