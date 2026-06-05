import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export const useExpansions = (gameId, userId) => {
	const [expansions, setExpansions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!gameId || !userId) {
			setLoading(false);
			return;
		}

		let mounted = true;

		const fetchExpansions = async () => {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("expansions")
				.select("*")
				.eq("game_id", gameId)
				.eq("user_id", userId)
				.order("created_at", { ascending: true });

			if (!mounted) return;

			if (error) {
				setError("Failed to load expansions.");
			} else {
				setExpansions(data ?? []);
			}

			setLoading(false);
		};

		fetchExpansions();

		return () => {
			mounted = false;
		};
	}, [gameId, userId]);

	const addExpansion = useCallback(
		async (expansion) => {
			const { data, error } = await supabase
				.from("expansions")
				.insert({ ...expansion, game_id: gameId, user_id: userId })
				.select()
				.single();

			if (!error) setExpansions((prev) => [...prev, data]);
			return { error };
		},
		[gameId, userId],
	);

	const removeExpansion = useCallback(
		async (id) => {
			const { error } = await supabase
				.from("expansions")
				.delete()
				.eq("id", id)
				.eq("user_id", userId);

			if (!error)
				setExpansions((prev) => prev.filter((e) => e.id !== id));
			return { error };
		},
		[userId],
	);

	const updateExpansion = useCallback(
		async (id, updates) => {
			const { data, error } = await supabase
				.from("expansions")
				.update(updates)
				.eq("id", id)
				.eq("user_id", userId)
				.select()
				.single();

			if (!error)
				setExpansions((prev) =>
					prev.map((e) => (e.id === id ? data : e)),
				);
			return { error };
		},
		[userId],
	);

	return {
		expansions,
		loading,
		error,
		addExpansion,
		removeExpansion,
		updateExpansion,
	};
};
