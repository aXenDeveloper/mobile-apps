import { StyleSheet } from "react-native";

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
		backgroundColor: '#eeeff1'
	},

	/* General purpoe styles */
	unreadBackground: {
		backgroundColor: '#ffffff',
	},
	readBackground: {
		backgroundColor: '#f5f5f7'
	},
	smallText: {
		fontSize: 13
	},
	lightText: {
		color: '#8F8F8F'
	},
	title: {
		color: '#000'
	},
	titleRead: {
		color: '#505050'
	}
});

export const styleVars = {
	tabActive: '#1f82a7',
	tabInactive: '#6e797e',
	citationTextStyle: `color: #222222; fontSize: 13; fontWeight: bold;`	
};

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

export default styles;
