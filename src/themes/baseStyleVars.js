import { Platform } from "react-native";

const baseStyleVars = {
	base: () => ({
		statusBarStyle: "light-content",
		text: "#464646",
		lightText: "#898989",
		veryLightText: "#9ba3ab",
		reverseText: "#fff",
		accentColor: "#3370AA",
		altAccentColor: "#009BA2",
		popularColor: "#F58D23",
		appBackground: "#F2F4F7",
		tabActive: "#37454B",
		tabInactive: "#6e797e",
		primaryTabActive: Platform.OS === "ios" ? "#37454B" : "#3370AA",
		primaryTabInactive: "#6e797e",
		citationTextStyle: `color: #222222; fontSize: 13; fontWeight: bold;`,
		placeholderColors: ["#ededed", "#f5f5f5"],
		touchColor: "rgba(0,0,0,0.05)",
		touchOpacity: 0.7,
		toggleTint: "#1888a7",
		toggleTintInverse: "#a8dae8",
		primaryBrand: ["#3370AA", "#009BA2"],
		unread: "#3370AA",
		headerText: "#fff",
		primaryButton: {
			mainColor: "#3370AA",
			inverseColor: "#fff"
		},
		lightButton: {
			mainColor: "#ecf0f3",
			inverseColor: "#262b2f"
		},
		darkButton: {
			mainColor: "#1d2e3c",
			inverseColor: "#fff"
		},
		warningButton: {
			mainColor: "#cc1e3a",
			inverseColor: "#fff"
		},
		spacing: {
			veryTight: 4,
			tight: 8,
			standard: 12,
			wide: 16,
			veryWide: 20,
			extraWide: 24
		},
		fontSizes: {
			tiny: 11,
			small: 13,
			standard: 14,
			content: 15,
			large: 17,
			extraLarge: 19
		},
		fontFamily: "System",
		lineHeight: {
			standard: 18
		},
		positive: "#43A047",
		negative: "#E53935",
		borderColors: {
			dark: "#CED6DB",
			medium: "#e1e7eb",
			light: "#f5f5f5"
		},
		checkmarkColor: "#3370AA",
		searchHighlight: "#fff4d4",
		searchHighlightText: "#000",
		tabBar: {
			active: "#3370AA",
			inactive: "#657686",
			underline: {
				height: 2,
				backgroundColor: "#3370AA"
			}
		},
		badgeBackground: "#e52418",
		badgeText: "#fff",
		greys: {
			light: "#fafafa",
			medium: "#F2F4F5",
			darker: "#DADDE0",
			placeholder: "#7E8387"
		},
		moderatedBackground: {
			light: "#FFF5F7",
			medium: "#FCEBEE"
		},
		moderatedText: {
			light: "#BE909A",
			medium: "#84263A",
			text: "#863A4B",
			title: "#821C32"
		}
	}),
	lightMode: () => ({}),
	darkMode: () => ({})
};

export default baseStyleVars;
