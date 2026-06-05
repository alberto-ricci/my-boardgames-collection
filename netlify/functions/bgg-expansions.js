const { searchGames, jsonResponse, getApiKey } = require("./utils/meepleit");

const parseExpansion = (game) => ({
	bgg_id: game.id,
	name: game.rawName,
	year_published: game.yearPublished ?? null,
});

exports.handler = async (event) => {
	const name = event.queryStringParameters?.name;

	if (!name) {
		return jsonResponse(400, { error: "Missing name parameter" });
	}

	try {
		const apiKey = getApiKey();
		const games = await searchGames(name, apiKey);
		return jsonResponse(200, games.map(parseExpansion));
	} catch (err) {
		console.error("bgg-expansions error:", err.message);
		return jsonResponse(500, { error: err.message });
	}
};
