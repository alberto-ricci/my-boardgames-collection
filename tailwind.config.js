export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["DM Sans", "sans-serif"],
			},
			colors: {
				accent: {
					DEFAULT: "#3B82F6",
					dark: "#60A5FA",
				},
			},
		},
	},
	plugins: [],
};
