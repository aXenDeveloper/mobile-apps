import gql from "graphql-tag";

const OurPicksFragment = `
	fragment OurPicksFragment on core {
		__typename
		ourPicks: stream {
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
			}
		}
	}
`;

export default OurPicksFragment;