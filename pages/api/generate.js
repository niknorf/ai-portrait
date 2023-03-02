const generateAction = async (req, res) => {
	console.log("Recieved request");

	// Input from the body of the request
	const input = JSON.parse(req.body).input;

	// Add fetch request from Hugging Face
	const response = await fetch(
		`https://api-inference.huggingface.co/models/n0rf/sd-1-5-niknorf`,
		{
			headers: {
				Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
				"Content-Type": "application/json",
				"x-use-cache": "false",
			},
			method: "POST",
			body: JSON.stringify({
				inputs: input,
			}),
		}
	);

	const bufferToBase64 = (buffer) => {
		let arr = new Uint8Array(buffer);
		const base64 = btoa(
			arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
		);
		return `data:image/png;base64,${base64}`;
	};

	// Check for different statuses to send proper payload
	if (response.ok) {
		const buffer = await response.arrayBuffer();
		// Convert to base64
		const base64 = bufferToBase64(buffer);
		res.status(200).json({ image: base64 });
	} else if (response.status === 503) {
		const json = await response.json();
		res.status(503).json(json);
	} else {
		const json = await response.json();
		res.status(response.status).json({ error: response.statusText });
	}
};

export default generateAction;
