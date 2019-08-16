import { Platform } from "react-native";

const themeRed = {
	base: () => ({
		// Overall UI
		accentColor: "#e53935",
		altAccentColor: "#afb42b",
		primaryBrand: ["#e53935", "#e53935"],
		appBackground: "#faf7f8",
		tabActive: "#4b3737",
		tabInactive: "#7e6e6e",
		primaryTabActive: Platform.OS === "ios" ? "#4b3737" : "#bb3b38",
		primaryTabInactive: "#7e6e6e",
		unread: {
			active: "#e53935"
		},

		// Text styling
		veryLightText: "#ab9b9b",
		backgroundText: "",
		backgroundLightText: "#8f7b7b",
		titleColors: {
			dark: "#2b1919",
			darker: "#1b0d0d"
		},

		// Button styling
		primaryButton: {
			mainColor: "#2b2525",
			inverseColor: "#fff"
		},
		lightButton: {
			mainColor: "#f3ecec",
			inverseColor: "#2f2626"
		},
		darkButton: {
			mainColor: "#3c1d1d",
			inverseColor: "#fff"
		},
		warningButton: {
			mainColor: "#cc1e3a",
			inverseColor: "#fff"
		},

		greys: {
			light: "#fafafa",
			medium: "#f5f2f2",
			darker: "#e0dbda",
			placeholder: "#877f7e"
		},
		borderColors: {
			dark: "#dbcfce",
			medium: "#ebe2e1",
			light: "#f5f5f5"
		},

		checkmarkColor: "#e53935",

		actionBar: {
			darkBackground: "#312a2a",
			lightBackground: "#fafafa"
		}
	}),
	lightMode: () => ({}),
	darkMode: () => ({})
};

export default themeRed;
