import gql from "graphql-tag";

const ActiveUsersFragment = `
	fragment ActiveUsersFragment on core {
		__typename
		activeUsers {
			__typename
			count(includeGuests: true)
			users(limit: 14) {
				anonymous
				lang
				timestamp
				user {
					id
					name
					photo
				}
			}
		}
	}
`;

export default ActiveUsersFragment;