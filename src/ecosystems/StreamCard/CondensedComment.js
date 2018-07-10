import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

import UserPhoto from '../../atoms/UserPhoto';
import RichTextContent from '../../atoms/RichTextContent';
import relativeTime from '../../utils/RelativeTime';

export default class CondensedComment extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return <Text>CondensedComment</Text>
	}
}