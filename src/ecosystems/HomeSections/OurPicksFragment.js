import gql from "graphql-tag";

const OurPicksFragment = `
	fragment OurPicksFragment on core {
		__typename
		ourPicks {
			id
			addedBy {
				name
			}
			url {
				full
				app
				controller
				module
			}
			title
			description
			images
			dataCount {
				count
				words
			}
			reputation {
				reactionCount
				reactions {
					id
					image
					count
				}
			}
		}
	}
`;

export default OurPicksFragment;