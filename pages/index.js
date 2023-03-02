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
	// Limit generate retries to 20
	const maxRetries = 20;
	const [input, setInput] = useState("");
	const [img, setImg] = useState("");
	const [retry, setRetry] = useState(0);
	const [retryCount, setRetryCount] = useState(maxRetries);
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

	const sleep = (ms) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	useEffect(() => {
		const runRetry = async () => {
			if (retryCount === 0) {
				console.log(
					`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
				);
				setRetryCount(maxRetries);
				return;
			}

			console.log(`Trying again in ${retry} seconds.`);
			setStatus(
				`Please wait, the model is loading. Trying again in ${retry} seconds.`
			);

			await sleep(retry * 1000);

			await generateAction();
		};

		if (retry === 0) {
			return;
		}

		runRetry();
	}, [retry]);

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

	return (
		<div className="root">
			<Head>
				<title>AI Portrait Generator</title>
			</Head>
			<div className="container">
				<div className="header">
					<div className="header-title">
						<h1>AI Portrait generator trained on Nikita's face</h1>
					</div>
					<div className="header-subtitle">
						<h2>
							Turn me into anyone you want! Make sure you refer to me as
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
								onClick={generateAction}
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
							⚠️ This model runs on a free{" "}
							<a href="https://huggingface.co" className="huggingtext">
								Hugging Face
							</a>{" "}
							instance.
							<p>Initial loading might take up to 5 minutes.</p>
						</div>
					</div>
				</div>
				{img && (
					<div className="output-content">
						<Image src={img} width={512} height={512} alt={input} />
						<p>{finalPrompt}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
