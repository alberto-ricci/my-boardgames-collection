const https = require("https");
const { parseStringPromise } = require("xml2js");

const fetch = (url) =>
	new Promise((resolve, reject) => {
		const options = {
			headers: {
				"User-Agent": "BoardGameCollectionApp/1.0",
				Accept: "application/xml",
			},
		};
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

	try {
		// Step 1 — search by name
		const searchRes = await fetch(
			`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(name)}&type=boardgame`,
		);

		console.log("Search status:", searchRes.status);
		console.log("Search preview:", searchRes.body.slice(0, 300));

		if (searchRes.status !== 200) {
			return {
				statusCode: 502,
				body: JSON.stringify({
					error: `BGG returned status ${searchRes.status}`,
				}),
			};
		}

		const searchResult = await parseStringPromise(searchRes.body);
		const items = searchResult?.items?.item ?? [];

		if (items.length === 0) {
			return {
				statusCode: 200,
				body: JSON.stringify([]),
			};
		}

		// Take top 5 results
		const topIds = items
			.slice(0, 5)
			.map((item) => item.$.id)
			.join(",");

		// Step 2 — fetch details
		const detailRes = await fetch(
			`https://boardgamegeek.com/xmlapi2/thing?id=${topIds}&stats=1`,
		);

		console.log("Detail status:", detailRes.status);
		console.log("Detail preview:", detailRes.body.slice(0, 300));

		if (detailRes.status !== 200) {
			return {
				statusCode: 502,
				body: JSON.stringify({
					error: `BGG detail returned status ${detailRes.status}`,
				}),
			};
		}

		const detailResult = await parseStringPromise(detailRes.body);
		const games = detailResult?.items?.item ?? [];

		const parsed = games.map((game) => {
			const name =
				game.name?.find((n) => n.$?.type === "primary")?.$?.value ??
				game.name?.[0]?.$?.value ??
				"Unknown";

			const categories = (game.link ?? [])
				.filter((l) => l.$?.type === "boardgamecategory")
				.map((l) => l.$?.value)
				.filter(Boolean);

			const mechanics = (game.link ?? [])
				.filter((l) => l.$?.type === "boardgamemechanic")
				.map((l) => l.$?.value)
				.filter(Boolean);

			return {
				bgg_id: game.$.id,
				name,
				year_published:
					parseInt(game.yearpublished?.[0]?.$?.value) || null,
				min_players: parseInt(game.minplayers?.[0]?.$?.value) || null,
				max_players: parseInt(game.maxplayers?.[0]?.$?.value) || null,
				min_playtime: parseInt(game.minplaytime?.[0]?.$?.value) || null,
				max_playtime: parseInt(game.maxplaytime?.[0]?.$?.value) || null,
				description:
					game.description?.[0]
						?.replace(/&#10;/g, " ")
						?.replace(/&amp;/g, "&")
						?.replace(/<[^>]+>/g, "")
						?.trim()
						?.slice(0, 500) ?? null,
				thumbnail: game.thumbnail?.[0] ?? null,
				categories: [...new Set([...categories, ...mechanics])].slice(
					0,
					6,
				),
			};
		});

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
