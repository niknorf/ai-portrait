import "../styles/styles.css";
import { Manrope } from "@next/font/google";

const manrope = Manrope({
	subsets: ["latin"],
	weight: ["400", "700", "800"],
});

function MyApp({ Component, pageProps }) {
	return (
		<main className={manrope.className}>
			<Component {...pageProps} />
		</main>
	);
}

export default MyApp;
