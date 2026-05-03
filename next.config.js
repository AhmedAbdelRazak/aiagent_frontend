// next.config.js
const path = require("path");
const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	productionBrowserSourceMaps: false,
	// Keep dev output separate from production build artifacts.
	// This avoids .next corruption / missing-file races on Windows when
	// a dev server and build output step on the same directory.
	distDir: isDev ? ".next-dev" : ".next",
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
	async headers() {
		const headers = [
			{ key: "X-Content-Type-Options", value: "nosniff" },
			{ key: "X-Frame-Options", value: "DENY" },
			{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
			{
				key: "Permissions-Policy",
				value: "camera=(), microphone=(), geolocation=(), payment=()",
			},
		];
		if (!isDev) {
			headers.push({
				key: "Strict-Transport-Security",
				value: "max-age=15552000; includeSubDomains",
			});
		}
		return [
			{
				source: "/(.*)",
				headers,
			},
		];
	},
};

module.exports = nextConfig;
