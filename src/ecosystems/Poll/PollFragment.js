import gql from "graphql-tag";

const PollFragment = gql`
	fragment PollFragment on core_Poll {
		id
		title
		votes
		questions {
			id
			title
			isMultiChoice
			choices {
				id
				title
				votes
				votedFor
			}
		}
		closeTimestamp
		isClosed
		isPublic
		hasVoted
		canVote
		canViewResults
		canViewVoters
		canClose
	}
`;

export default PollFragment;
