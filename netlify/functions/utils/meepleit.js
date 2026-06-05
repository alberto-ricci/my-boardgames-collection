const https = require("https");

const RAPIDAPI_HOST = "meepleit.p.rapidapi.com";
const SEARCH_ENDPOINT = `https://${RAPIDAPI_HOST}/meepleit-search`;

const httpGet = (url, options) =>
	new Promise((resolve, reject) => {
		https.get(url, options, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () =>
				resolve({ status: res.statusCode, body: data }),
			);
			res.on("error", reject);
		});
	});

const searchGames = async (name, apiKey, limit = 5) => {
	const url = `${SEARCH_ENDPOINT}?search=${encodeURIComponent(name)}&limit=${limit}`;

	const res = await httpGet(url, {
		headers: {
			"x-rapidapi-key": apiKey,
			"x-rapidapi-host": RAPIDAPI_HOST,
			"Content-Type": "application/json",
		},
	});

	if (res.status !== 200) {
		throw new Error(`MeepleIt returned status ${res.status}`);
	}

	const data = JSON.parse(res.body);
	return data.games ?? [];
};

const jsonResponse = (statusCode, body, extra = {}) => ({
	statusCode,
	headers: { "Content-Type": "application/json", ...extra },
	body: JSON.stringify(body),
});

const getApiKey = () => {
	const key = process.env.RAPIDAPI_KEY;
	if (!key) throw new Error("Missing RAPIDAPI_KEY environment variable");
	return key;
};

module.exports = { searchGames, jsonResponse, getApiKey };
