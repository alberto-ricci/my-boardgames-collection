const https = require("https");

const fetch = (url, options) =>
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

exports.handler = async (event) => {
	const name = event.queryStringParameters?.name;

	if (!name) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Missing name parameter" }),
		};
	}

	const apiKey = process.env.RAPIDAPI_KEY;

	if (!apiKey) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Missing API key" }),
		};
	}

	try {
		const res = await fetch(
			`https://meepleit.p.rapidapi.com/meepleit-search?search=${encodeURIComponent(name)}&limit=5`,
			{
				headers: {
					"x-rapidapi-key": apiKey,
					"x-rapidapi-host": "meepleit.p.rapidapi.com",
					"Content-Type": "application/json",
				},
			},
		);

		if (res.status !== 200) {
			return {
				statusCode: 502,
				body: JSON.stringify({
					error: `API returned status ${res.status}`,
				}),
			};
		}

		const data = JSON.parse(res.body);
		const games = data.games ?? [];

		const parsed = games.slice(0, 5).map((game) => ({
			bgg_id: game.id,
			name: game.rawName,
			year_published: game.yearPublished ?? null,
			min_players: game.minPlayers ?? null,
			max_players: game.maxPlayers ?? null,
			min_playtime: game.minPlayTime ?? null,
			max_playtime: game.maxPlayTime ?? null,
			description: null,
			thumbnail: null,
			categories: [
				...(game.categories ?? []),
				...(game.mechanics ?? []),
			].slice(0, 6),
		}));

		return {
			statusCode: 200,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed),
		};
	} catch (err) {
		console.error("Function error:", err.message);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
};
