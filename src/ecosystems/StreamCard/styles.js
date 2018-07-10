import { StyleSheet } from 'react-native';

const componentStyles = StyleSheet.create({
	blob: {
		backgroundColor: '#888',
		width: 11,
		height: 11,
		borderRadius: 11,
		position: 'absolute',
		left: -22,
		top: 9
	},
	imageContainer: {
		height: 150,
		width: '100%',
	},
	image: {
		flex: 1
	},
	metaTextWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		padding: 9
	},
	metaText: {
		fontSize: 13,
	},
	contentItemInfo: {
		padding: 12
	},
	snippetText: {
		fontSize: 15
	},
	postWrapper: {
		marginBottom: 7
	},
	post: {
		paddingBottom: 0
	},
	postHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 12
	},
	postInfo: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		flex: 1
	},
	meta: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		//marginLeft: 9
	},
	username: {
		fontSize: 17,
		fontWeight: "600",
		color: '#171717',
	},
	date: {
		fontSize: 14,
		color: '#8F8F8F'
	},
	postContentContainer: {
		marginTop: 16
	},
	postContent: {
		fontSize: 16
	},
	postMenu: {
		width: 24,
		height: 24
	},
	postInfoButton: {
		alignSelf: 'flex-start',
	},
	postReactionList: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginTop: 15
	},
	reactionItem: {
		marginLeft: 10
	}
});

export default componentStyles;