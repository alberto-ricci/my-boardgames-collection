const { searchGames, jsonResponse, getApiKey } = require("./utils/meepleit");

const parseGame = (game) => ({
	bgg_id: game.id,
	name: game.rawName,
	year_published: game.yearPublished ?? null,
	min_players: game.minPlayers ?? null,
	max_players: game.maxPlayers ?? null,
	min_playtime: game.minPlayTime ?? null,
	max_playtime: game.maxPlayTime ?? null,
	description: null,
	thumbnail: null,
	categories: [...(game.categories ?? []), ...(game.mechanics ?? [])].slice(
		0,
		6,
	),
});

exports.handler = async (event) => {
	const name = event.queryStringParameters?.name;

	if (!name) {
		return jsonResponse(400, { error: "Missing name parameter" });
	}

	try {
		const apiKey = getApiKey();
		const games = await searchGames(name, apiKey);
		return jsonResponse(200, games.map(parseGame));
	} catch (err) {
		console.error("bgg-search error:", err.message);
		return jsonResponse(500, { error: err.message });
	}
};
