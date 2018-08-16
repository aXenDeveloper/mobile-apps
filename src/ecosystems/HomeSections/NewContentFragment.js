import gql from "graphql-tag";

const NewContentFragment = `
	fragment NewContentFragment on core {
		__typename
		newContent: stream(id: 1) {
			id
			__typename
			title
			items {
				__typename
				indexID
				itemID
				url {
					__typename
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
					__typename
					id
					name
					photo
				}
				author {
					__typename
					id
					name
					photo
				}
				firstCommentRequired
				articleLang {
					indefinite
					definite
				}
			}
		}
	}
`;

export default NewContentFragment;