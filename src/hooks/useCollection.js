import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export const useCollection = (userId) => {
	const [collection, setCollection] = useState([]);
	const [filteredGames, setFilteredGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchCollection = useCallback(async () => {
		if (!userId) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		const { data, error } = await supabase
			.from("games")
			.select("*, expansions(count)")
			.eq("user_id", userId)
			.order("name", { ascending: true });

		if (error) {
			setError("Failed to load collection.");
		} else {
			const gamesWithCount = data.map((g) => ({
				...g,
				expansion_count: g.expansions?.[0]?.count ?? 0,
			}));
			setCollection(gamesWithCount);
			setFilteredGames(gamesWithCount);
		}

		setLoading(false);
	}, [userId]);

	useEffect(() => {
		fetchCollection();
	}, [fetchCollection]);

	const addGame = useCallback((game) => {
		setCollection((prev) => {
			const updated = [...prev, { ...game, expansion_count: 0 }];
			return updated.sort((a, b) => a.name.localeCompare(b.name));
		});
	}, []);

	const updateGame = useCallback((updatedGame) => {
		setCollection((prev) =>
			prev.map((g) =>
				g.id === updatedGame.id
					? { ...updatedGame, expansion_count: g.expansion_count }
					: g,
			),
		);
	}, []);

	const removeFromCollection = useCallback(
		async (gameId) => {
			const { error } = await supabase
				.from("games")
				.delete()
				.eq("id", gameId)
				.eq("user_id", userId);

			if (!error) {
				setCollection((prev) => prev.filter((g) => g.id !== gameId));
			}
		},
		[userId],
	);

	return {
		collection,
		filteredGames,
		setFilteredGames,
		loading,
		error,
		removeFromCollection,
		addGame,
		updateGame,
		refetch: fetchCollection,
	};
};
