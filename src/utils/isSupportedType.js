import supportedTypes from '../supportedTypes'

export default function isSupportedType(className) {
	const fixedClassName = className.replace("\\\\", "\\", 'g');
	return supportedTypes.indexOf( fixedClassName ) !== -1;
}