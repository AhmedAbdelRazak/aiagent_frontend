/* Polished YouTube‑inspired palette with a softer neutral base */
const palette = {
	ytRed: "#FF3D3D",
	navy: "#213147",
	white: "#FFFFFF",
	gray50: "#F5F5F5",
	gray200: "#E5E5E5",
	gray600: "#606060",
	gray900: "#0F0F0F",
	success: "#16A34A",
	warning: "#FACC15",
	danger: "#DC2626",
};

export const lightTheme = {
	colors: {
		primary: palette.ytRed,
		secondary: palette.navy,
		background: palette.white,
		cardBg: palette.gray50,
		text: palette.gray900,
		mutedText: palette.gray600,
		border: palette.gray200,
		success: palette.success,
		warning: palette.warning,
		danger: palette.danger,
	},
	fonts: {
		body: "'Inter', system-ui, sans-serif",
		mono: "'JetBrains Mono', ui-monospace, monospace",
	},
	fontSizes: {
		xs: "0.75rem",
		sm: "0.875rem",
		md: "1rem",
		lg: "1.25rem",
		xl: "1.5rem",
		"2xl": "2rem",
		"3xl": "2.5rem",
	},
	breakpoints: {
		xs: "320px",
		sm: "480px",
		md: "768px",
		lg: "1024px",
		xl: "1280px",
		"2xl": "1536px",
	},
	containerPad: "clamp(1rem, 5vw, 3rem)",
};
