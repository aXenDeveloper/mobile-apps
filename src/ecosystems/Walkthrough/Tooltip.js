// @flow
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Button from "../../atoms/Button";
import styles from "../../styles";

const Tooltip = ({ isFirstStep, isLastStep, handleNext, handlePrev, handleStop, currentStep }) => (
	<View>
		<View style={componentStyles.tooltipContainer}>
			<Text testID="stepDescription" style={[styles.text, styles.standardText]}>
				{currentStep.text}
			</Text>
		</View>
		<View style={[componentStyles.bottomBar]}>
			{!isLastStep ? <Button fullWidth={false} onPress={handleStop} title="Skip" size="small" /> : null}
			{!isLastStep ? (
				<Button fullWidth={false} onPress={handleNext} title="Got it" size="small" />
			) : (
				<Button fullWidth={false} onPress={handleStop} title="Got it" size="small" />
			)}
		</View>
	</View>
);

export default Tooltip;

const componentStyles = StyleSheet.create({
	tooltipContainer: {
		flex: 1
	},
	tooltip: {
		position: "absolute",
		paddingTop: 15,
		paddingHorizontal: 15,
		backgroundColor: "#fff",
		borderRadius: 3,
		overflow: "hidden"
	},
	bottomBar: {
		marginVertical: 15,
		flexDirection: "row",
		justifyContent: "flex-start"
	}
});