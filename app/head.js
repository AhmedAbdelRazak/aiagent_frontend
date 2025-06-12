// app/head.js

export default function Head() {
	return (
		<>
			<meta charSet='UTF-8' />
			{/* Default SEO tags; per-page tags override these */}
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<link rel='icon' href='/favicon.ico' />
		</>
	);
}
