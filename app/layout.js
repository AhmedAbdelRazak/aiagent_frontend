/* app/layout.js ------------------------------------------------------------ */
import ClientProviders from "./ClientProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";

/* ---------- global <head> metadata ---------- */
export const metadata = {
	title: {
		default: "AiVideomatic | AI‑Powered Social Media Posting",
		template: "%s | AiVideomatic",
	},
	description:
		"AiVideomatic automatically scripts, renders, schedules, and posts your videos to YouTube, Facebook, and Instagram using AI.",
	keywords:
		"AiVideomatic, AI video automation, social media scheduling, YouTube automation, Facebook video, Instagram video",
	// icons: { icon: "/favicon.ico" },
	verification: {
		google: "47ejHEFZmQ6Am644qP3hd1Y1v5WQk-6sroDUTF0RF5Q",
	},
};

/* ---------- viewport (new separate export) ---------- */
export const viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>
				<GoogleOAuthProvider
					clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
				>
					<ClientProviders>{children}</ClientProviders>
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}
