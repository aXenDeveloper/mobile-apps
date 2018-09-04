import gql from "graphql-tag";

const FollowModalFragment = gql`
	fragment FollowModalFragment on Follow {
		isFollowing
		followOptions {
			type
			disabled
			selected
		}
		followCount
		followers {
			id
			name
			photo
		}
		anonFollowCount
	}
`;

export default FollowModalFragment;