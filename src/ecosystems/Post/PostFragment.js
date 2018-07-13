import gql from "graphql-tag";

const PostFragment = gql`
	fragment PostFragment on forums_post {
		id
		__typename
		url {
			__typename
			full
			app
			module
			controller
		}
		timestamp
		author {
			__typename
			id
			photo
			name
		}
		content
		reputation {
			__typename
			canReact
			hasReacted
			canViewReps
			isLikeMode
			givenReaction {
				__typename
				id
				image
				name
			}
			defaultReaction {
				__typename
				id
				image
				name
			}
			availableReactions {
				__typename
				id
				image
				name
			}
			reactions {
				__typename
				id
				image
				name
				count
			}
		}
	}
`;

export default PostFragment;
