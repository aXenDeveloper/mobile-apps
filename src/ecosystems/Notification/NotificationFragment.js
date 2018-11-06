import gql from "graphql-tag";

const NotificationFragment = gql`
	fragment NotificationFragment on core_Notification {
		id
		type
		app
		class
		itemID
		sentDate
		updatedDate
		readDate
		author {
			id
			photo
		}
		title
		content
		url {
			full
			app
			module
			controller
		}
		unread
	}
`;

export default NotificationFragment;
