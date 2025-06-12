// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	compiler: {
		styledComponents: {
			// enable server-side rendering of styles
			ssr: true,
			// add component names to class names (great for debugging)
			displayName: true,
			// optional: omit filenames from class names in production
			// fileName: false,
		},
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
	},
	webpack: (config) => {
		config.resolve.alias["@"] = path.join(__dirname, "app");
		return config;
	},
};

module.exports = nextConfig;
