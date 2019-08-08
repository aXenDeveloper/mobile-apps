import React, { memo } from "react";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";

import NavigationService from "../utils/NavigationService";
import HeaderButton from "./HeaderButton";
import styles, { styleVars } from "../styles";
import icons from "../icons";
import { switchAppView } from "../redux/actions/app";
import configureStore from "../redux/configureStore";

const store = configureStore();

const GoToMulti = props => {
	if (!Expo.Constants.manifest.extra.multi) {
		return null;
	}

	return <HeaderButton icon={icons.BARS} position="left" onPress={() => store.dispatch(switchAppView({ view: "multi" }))} size={20} />;
};

export default memo(GoToMulti);
