import { SET_FORUM_PASSWORD } from "../actions/site";

const initialState = {
	
};

export default function forums(state = initialState, { type, payload }) {
	switch (type) {
		case SET_FORUM_PASSWORD:
			return {
				...state,
				[payload.forumID]: payload.password
			};
		default:
			return { ...state };
	}
}
