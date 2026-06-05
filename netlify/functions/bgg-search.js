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
			`https://meepleit.p.rapidapi.com/games/search?query=${encodeURIComponent(name)}`,
			{
				headers: {
					"x-rapidapi-key": apiKey,
					"x-rapidapi-host": "meepleit.p.rapidapi.com",
				},
			},
		);

		console.log("MeepleIt status:", res.status);
		console.log("MeepleIt preview:", res.body.slice(0, 300));

		if (res.status !== 200) {
			return {
				statusCode: 502,
				body: JSON.stringify({
					error: `API returned status ${res.status}`,
				}),
			};
		}

		const data = JSON.parse(res.body);
		const games = Array.isArray(data)
			? data
			: (data.games ?? data.results ?? []);

		const parsed = games.slice(0, 5).map((game) => ({
			bgg_id: game.id ?? game.bgg_id ?? null,
			name: game.name ?? game.title ?? "Unknown",
			year_published: game.year_published ?? game.year ?? null,
			min_players: game.min_players ?? null,
			max_players: game.max_players ?? null,
			min_playtime: game.min_playtime ?? null,
			max_playtime: game.max_playtime ?? null,
			description: game.description?.slice(0, 500) ?? null,
			thumbnail: game.thumbnail ?? game.image ?? null,
			categories: [
				...(game.categories?.map((c) => c.name ?? c) ?? []),
				...(game.mechanics?.map((m) => m.name ?? m) ?? []),
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
