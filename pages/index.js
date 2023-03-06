import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import localFont from "@next/font/local";

const pricedown = localFont({
	src: "../assets/fonts/pricedow.woff2",
	variable: "--gta-font",
});

const jedi = localFont({
	src: "../assets/fonts/jedi.ttf",
	variable: "--jedi-font",
});

const Home = () => {
	// Banana inference
	const [prediction, setPrediction] = useState(null);

	const handleSubmit = async (e) => {
		setIsGenerating(true);
		setStatus("Generating...");

		e.preventDefault();
		var prompt = input;
		const response = await fetch("/api/banana", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt: prompt,
			}),
		});
		let prediction = await response.json();
		setPrediction(prediction);
		setFinalPrompt(input);
		setIsGenerating(false);
		setInput("");
		setStatus("Ready!");
	};

	// Limit generate retries to 20
	const maxRetries = 20;
	const [input, setInput] = useState("");
	const [img, setImg] = useState("");
	const [retry, setRetry] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);
	const [finalPrompt, setFinalPrompt] = useState("");
	const [status, setStatus] = useState("");
	const onChange = (event) => {
		setInput(event.target.value);
	};
	const generateAction = async () => {
		console.log("Generating...");
		setStatus("Generating...");

		if (isGenerating && retry === 0) return;

		setIsGenerating(true);

		if (retry > 0) {
			setRetryCount((prevState) => {
				if (prevState === 0) {
					return 0;
				} else {
					return prevState - 1;
				}
			});

			setRetry(0);
		}

		const finalInput = input.replace(/nik/gi, "niknorf");
		// Fetch request
		const response = await fetch("/api/generate", {
			method: "POST",
			headers: {
				"Content-Type": "image/jpeg",
			},
			body: JSON.stringify({ input: finalInput }),
		});

		const data = await response.json();

		// If the model is still loading
		if (response.status === 503) {
			setRetry(data.estimated_time);
			return;
		}

		// If another error
		if (!response.ok) {
			console.log(`Error: ${data.error}`);
			setStatus(`Error: ${data.error}`);
			// Stop loading
			setIsGenerating(false);
			return;
		}

		// Set final prompt here
		setFinalPrompt(input);
		// Remove content from input box
		setInput("");

		setStatus("Ready!");

		setImg(data.image);
		setIsGenerating(false);
	};

	const starWars = () => {
		setInput(
			"nik as a jedi, obi - wan kenobi from star wars, digital portrait by greg rutkowski, intricate, sharp focus, cinematic, epic, artstation"
		);
	};

	const pixar = () => {
		setInput(
			"portrait of nik as a pixar disney character from up ( 2 0 0 9 ), unreal engine, octane render, 3 d render, photorealistic"
		);
	};

	const gta = () => {
		setInput(
			"nik as a character in the game GTA V, with a background based on the game GTA V, detailed face, photorealistic pAINTING BY android jones, alex grey, chris dyer, and aaron brooks"
		);
	};

	const runGeneration = (e) => {
		if (e.key === "Enter") {
			generateAction();
		}
	};

	const githubLink = () => {
		window.open("https://github.com/niknorf/ai-portrait");
	};

	return (
		<div className="root">
			<Head>
				<title>AI Portrait Generator</title>
			</Head>
			<div className="container">
				<div className="header">
					<div className="header-title">
						<h1>AI Portrait generator trained on Nikita&apos;s face</h1>
					</div>
					<div className="header-subtitle">
						<h2>
							Make sure you refer to the trained concept as
							<strong className="name-token"> nik</strong> in the prompt
						</h2>
					</div>

					<a className="predefined">Or use predefined styles below 👇</a>

					<div className="styles-buttons">
						<div
							className="style-button star-wars"
							onClick={starWars}
							onKeyDown={runGeneration}
						>
							<div className={jedi.variable}>
								<a className="stext">Star Wars</a>
							</div>
						</div>
						<div
							className="style-button pixar"
							onClick={pixar}
							onKeyDown={runGeneration}
						>
							<a>Pixar</a>
						</div>
						<div
							className="style-button gta"
							onClick={gta}
							onKeyDown={runGeneration}
						>
							<div className={pricedown.variable}>
								<a className="gtext">GTA</a>
							</div>
						</div>
					</div>
					<div className="prompt-container">
						<input
							className="prompt-box"
							value={input}
							onChange={onChange}
							onKeyDown={runGeneration}
						></input>
						<div className="prompt-buttons">
							<div className="status">{status}</div>
							<a
								className={
									isGenerating ? "generate-button loading" : "generate-button"
								}
								// onClick={generateAction}
								onClick={handleSubmit}
							>
								<div className="generate">
									{isGenerating ? (
										<span className="loader"></span>
									) : (
										<p>Generate</p>
									)}
								</div>
							</a>
						</div>
						<div className="warning">
							<p>
								⚠️ Due to the cold start of cloud GPU, initial generation might
								take up to 1,5 minutes.
							</p>
						</div>
					</div>
				</div>
				{prediction && (
					<div className="output-content">
						<Image src={prediction} width={512} height={512} alt={input} />
						<p>{finalPrompt}</p>
					</div>
				)}
				<div className="github-container">
					<button type="button" className="github-btn" onClick={githubLink}>
						<svg
							className="github-svg"
							aria-hidden="true"
							focusable="false"
							data-prefix="fab"
							data-icon="github"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 496 512"
						>
							<path
								fill="currentColor"
								d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
							></path>
						</svg>
						Source code on GitHub
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
