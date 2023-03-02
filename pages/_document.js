import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html>
			<Head>
				<link
					rel="shortcut icon"
					type="image/x-icon"
					href="/favicon/favicon.ico"
				/>
				<meta property="og:title" content="AI Avatar Generator" key="title" />
				<meta
					property="og:description"
					content="build with buildspace"
					key="description"
				/>
				<meta name="twitter:card" content="summary_large_image"></meta>
				<link
					rel="preload"
					as="font"
					href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap"
					crossOrigin="anonymous"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
