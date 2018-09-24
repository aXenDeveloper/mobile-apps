import gql from "graphql-tag";

const StreamCardFragment = gql`
	fragment StreamCardFragment on core_ContentSearchResult {
		indexID
		itemID
		url {
			full
			app
			module
			controller
		}
		containerID
		containerTitle
		class
		content
		contentImages
		title
		hidden
		updated
		created
		isComment
		isReview
		relativeTimeKey
		itemAuthor {
			id
			name
			photo
		}
		author {
			id
			name
			photo
		}
	}
`;

export default StreamCardFragment;
