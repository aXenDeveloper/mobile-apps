import gql from "graphql-tag";

const SearchResultFragment = gql`
	fragment SearchResultFragment on core_ContentSearchResult {
		indexID
		objectID
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
		replies
		isComment
		isReview
		relativeTimeKey
		firstCommentRequired
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
		articleLang {
			indefinite
			definite
			definiteUC
		}
	}
`;

export default SearchResultFragment;
