import _ from "underscore";

const globalErrors = [
	'NO_PERMISSION': "You don't have permission to do that."
];

export default function getErrorMessage(err, componentErrors) {
	let errors = Object.assign({}, globalErrors, componentErrors);

	if( !_.isUndefined( err.graphQLErrors ) && err.graphQLErrors.length ){
		if( !_.isUndefined( errors[ err.graphQLErrors[0].message ] ) ){
			return errors[ err.graphQLErrors[0].message ];
		}
	}

	return '';
}