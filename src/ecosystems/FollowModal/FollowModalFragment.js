import gql from "graphql-tag";

const FollowModalFragment = gql`
	fragment FollowModalFragment on Follow {
		id
		followID
		isFollowing
		followType
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