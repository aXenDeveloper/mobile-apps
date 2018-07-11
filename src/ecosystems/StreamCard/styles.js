import { StyleSheet } from 'react-native';

const componentStyles = StyleSheet.create({
	streamHeader: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		paddingHorizontal: 12,
		paddingTop: 12,
	},
	streamHeaderInner: {
		flex: 1
	},
	streamMeta: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		paddingBottom: 9,
		marginBottom: 9
	},
	streamMetaInner: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	streamMetaText: {
		fontSize: 14,
	},
	streamMetaTime: {
		color: '#8F8F8F'
	},
	streamMetaAction: {
		marginLeft: 5
	},
	streamItemInfo: {
		flex: 1,
		flexDirection: 'row',
	},
	streamItemInfoInnerWithPhoto: {
		marginLeft: 9
	},
	streamItemTitle: {
		fontSize: 17,
		fontWeight: "600",
		color: '#171717',
	},
	streamItemTitleSmall: {
		fontSize: 15
	},
	streamItemContainer: {
		color: '#8F8F8F',
	},
	streamFooter: {
		paddingHorizontal: 12,
		paddingBottom: 12
	},
	streamFooterIndented: {
		borderLeftWidth: 3,
		borderLeftColor: '#f0f0f0',
		paddingLeft: 12,
		paddingBottom: 0,
		marginBottom: 12,
		marginLeft: 12
	},
	snippetWrapper: {
		marginTop: 9
	},
	snippetText: {
		fontSize: 15
	},
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
		marginBottom: 12,
		marginTop: 12
	},
	image: {
		flex: 1
	},

	// ============
	metaTextWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		padding: 9
	},
	metaText: {
		fontSize: 13,
	},
	
	
	postWrapper: {
		marginBottom: 7
	},
	post: {
		paddingBottom: 0
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