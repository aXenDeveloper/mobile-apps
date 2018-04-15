import { TEST_USER } from "../actions/user";

const initialState = {
	loaded: false,
	id: 1
};

export default function user(state = initialState, { type, payload }) {
	switch (type) {
		case TEST_USER:
			return {
				...state
			};
		default:
			return { ...state };
	}
}
