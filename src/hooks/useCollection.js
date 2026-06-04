import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useCollection = (userId) => {
	const [collection, setCollection] = useState([]);
	const [filteredGames, setFilteredGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const addGame = (game) => {
		setCollection((prev) => [...prev, game]);
	};
	const updateGame = (updatedGame) => {
		setCollection((prev) =>
			prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)),
		);
	};

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			return;
		}

		const fetchCollection = async () => {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase.from("games").select("*");

			if (error) {
				setError("Failed to load collection.");
			} else {
				setCollection(data);
				setFilteredGames(data);
			}

			setLoading(false);
		};

		fetchCollection();
	}, [userId]);

	const removeFromCollection = async (gameId) => {
		const { error } = await supabase
			.from("games")
			.delete()
			.eq("id", gameId)
			.eq("user_id", userId);
		if (!error) {
			setCollection((prev) => prev.filter((game) => game.id !== gameId));
		}
	};

	return {
		collection,
		filteredGames,
		setFilteredGames,
		loading,
		error,
		removeFromCollection,
		addGame,
		updateGame,
	};
};
