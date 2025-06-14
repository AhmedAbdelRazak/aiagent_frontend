"use client";

/** Only use this component when meta information is decided client‑side. */
export default function SeoHead({
	title,
	description,
	keywords,
	ogImage = "/logo.png",
}) {
	return (
		<>
			{title && <title>{title}</title>}
			{description && <meta name='description' content={description} />}
			{keywords && <meta name='keywords' content={keywords} />}

			{/* Open Graph */}
			<meta property='og:title' content={title || "AiVideomatic"} />
			{description && <meta property='og:description' content={description} />}
			<meta property='og:type' content='website' />
			<meta
				property='og:url'
				content={
					process.env.NEXT_PUBLIC_CLIENT_URL || "https://aivideomatic.com"
				}
			/>
			<meta property='og:image' content={ogImage} />

			{/* Twitter */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={title || "AiVideomatic"} />
			{description && <meta name='twitter:description' content={description} />}
			<meta name='twitter:image' content={ogImage} />
		</>
	);
}
