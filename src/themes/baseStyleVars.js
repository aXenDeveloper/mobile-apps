import { Platform } from "react-native";

const greyScale = val => {
	const scale = {
		100: "#ffffff",
		200: "#F7FAFC",
		300: "#EDF2F7",
		400: "#E2E8F0",
		500: "#CBD5E0",
		600: "#718096",
		700: "#4A5568",
		800: "#2D3748",
		900: "#1A202C",
		1000: "#07080B"
	};

	return scale[val] || scale[100];
};

const baseStyleVars = {
	base: () => ({
		// Color scales
		greyScale: {
			100: greyScale(100),
			200: greyScale(200),
			300: greyScale(300),
			400: greyScale(400),
			500: greyScale(500),
			600: greyScale(600),
			700: greyScale(700),
			800: greyScale(800),
			900: greyScale(900),
			1000: greyScale(1000)
		},
		// Font size scale
		fontSizes: {
			tiny: 11,
			small: 13,
			standard: 14,
			content: 15,
			large: 17,
			extraLarge: 19
		},
		// Spacing scale
		spacing: {
			veryTight: 4,
			tight: 8,
			standard: 12,
			wide: 16,
			veryWide: 20,
			extraWide: 24
		},

		// Header stuff
		statusBarStyle: "light-content",
		headerText: greyScale(100),

		// Nav bar
		navBar: {
			background: greyScale(100),
			itemBackground: greyScale(200),
			itemText: greyScale(800)
		},

		// Footer stuff
		primaryTabBackground: greyScale(100),
		primaryTabActive: Platform.OS === "ios" ? greyScale(800) : "#3370AA",
		primaryTabInactive: greyScale(600),

		accentColor: "#3370AA",
		altAccentColor: "#009BA2",
		primaryBrand: ["#3370AA", "#009BA2"],
		appBackground: greyScale(300),
		tabActive: "#37454B",
		tabInactive: "#6e797e",

		unread: {
			active: "#3370AA",
			inactive: greyScale(500)
		},

		contentBackground: greyScale(100),

		// Text styling
		text: greyScale(800),
		lightText: greyScale(600),
		veryLightText: greyScale(500),
		reverseText: greyScale(100),
		backgroundLightText: greyScale(600),

		fontFamily: "System",
		lineHeight: {
			standard: 18
		},
		titleColors: {
			dark: greyScale(900),
			darker: greyScale(1000)
		},

		// Button styling
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

		// Moderated content
		moderatedBackground: {
			light: "#FFF5F7",
			medium: "#FCEBEE"
		},
		moderatedText: {
			light: "#BE909A",
			medium: "#84263A",
			text: "#863A4B",
			title: "#821C32"
		},

		// Action bar
		actionBar: {
			darkBackground: greyScale(800),
			darkText: greyScale(100),
			lightBackground: greyScale(200),
			lightText: greyScale(800)
		},

		// Forms
		formField: {
			background: greyScale(100),
			placeholderText: greyScale(300),
			border: greyScale(300),
			text: greyScale(800)
		},
		toggle: {
			true: "#1888a7",
			false: greyScale(300)
		},

		// Rich text
		richText: {
			quoteBackground: greyScale(200),
			quoteBorder: greyScale(400),
			quoteLeftBorder: greyScale(800),
			quoteCitation: greyScale(400),
			codeBackground: greyScale(200),
			citationTextStyle: `color: ${greyScale(900)}; fontSize: 13; fontWeight: bold;`
		},

		// Modal panels
		modal: {
			background: greyScale(100),
			titleColor: greyScale(1000),
			closeColor: greyScale(600),
			handleColor: greyScale(200)
		},

		loadMore: {
			background: greyScale(100),
			text: greyScale(700)
		},

		popularColor: "#F58D23",
		placeholderColors: {
			from: greyScale(300),
			to: greyScale(200)
		},
		touchColor: "rgba(0,0,0,0.05)",
		touchOpacity: 0.7,

		positive: "#43A047",
		negative: "#E53935",
		borderColors: {
			dark: greyScale(500),
			medium: greyScale(400),
			light: greyScale(300)
		},
		checkmarkColor: "#3370AA",
		searchHighlight: "#fff4d4",
		searchHighlightText: "#000",
		badgeBackground: "#e52418",
		badgeText: "#fff",
		rowArrow: greyScale(700),
		pagerBar: greyScale(400),
		greys: {
			light: greyScale(200),
			medium: greyScale(300),
			darker: greyScale(400),
			placeholder: "#7E8387"
		},

		// Deprecated
		toggleTint: "#1888a7",
		toggleTintInverse: "#a8dae8",
		tabBar: {
			active: "#3370AA",
			inactive: "#657686",
			underline: {
				height: 2,
				backgroundColor: "#3370AA"
			}
		}
	}),
	lightMode: () => ({}),
	darkMode: () => ({
		// Footer stuff
		primaryTabBackground: greyScale(900),
		primaryTabActive: Platform.OS === "ios" ? greyScale(100) : "#3370AA",
		primaryTabInactive: greyScale(500),

		appBackground: greyScale(900),
		contentBackground: greyScale(800),
		accentColor: "#5d95ca",
		text: greyScale(400),
		lightText: greyScale(500),
		titleColors: {
			dark: greyScale(200),
			darker: greyScale(100)
		},

		placeholderColors: {
			from: greyScale(700),
			to: greyScale(800)
		},

		greys: {
			light: greyScale(900),
			medium: greyScale(700),
			darker: greyScale(800),
			placeholder: "#7E8387"
		},

		borderColors: {
			dark: greyScale(700),
			medium: greyScale(900),
			light: greyScale(900)
		},

		unread: {
			active: "#5d95ca",
			inactive: greyScale(600)
		},

		// Action bar
		actionBar: {
			darkBackground: greyScale(200),
			darkText: greyScale(800),
			lightBackground: greyScale(900),
			lightText: greyScale(200)
		},

		// Nav bar
		navBar: {
			background: greyScale(800),
			itemBackground: greyScale(700),
			itemText: greyScale(400)
		},

		// Forms
		formField: {
			background: greyScale(800),
			placeholderText: greyScale(600),
			border: greyScale(900),
			text: greyScale(100)
		},
		toggle: {
			true: "#1888a7",
			false: greyScale(700)
		},

		// Rich text
		richText: {
			quoteBackground: greyScale(900),
			quoteBorder: greyScale(800),
			quoteLeftBorder: greyScale(700),
			quoteCitation: greyScale(700),
			codeBackground: greyScale(700),
			citationTextStyle: `color: ${greyScale(300)}; fontSize: 13; fontWeight: bold;`
		},

		// Moderated content
		moderatedBackground: {
			light: "#3B2C2F",
			medium: "#322427"
		},
		moderatedText: {
			light: "#BE909A",
			medium: "#84263A",
			text: "#D2C3C6",
			title: "#FAF2F3"
		},

		// Modal panels
		modal: {
			background: greyScale(800),
			titleColor: greyScale(100),
			closeColor: greyScale(300),
			handleColor: greyScale(600)
		},

		rowArrow: greyScale(600),
		pagerBar: greyScale(700),

		loadMore: {
			background: greyScale(800),
			text: greyScale(100)
		}
	})
};

export default baseStyleVars;
