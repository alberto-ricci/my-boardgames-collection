import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useExpansions = (gameId, userId) => {
	const [expansions, setExpansions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!gameId || !userId) {
			setLoading(false);
			return;
		}

		const fetch = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("expansions")
				.select("*")
				.eq("game_id", gameId)
				.eq("user_id", userId)
				.order("created_at", { ascending: true });

			if (!error) setExpansions(data ?? []);
			setLoading(false);
		};

		fetch();
	}, [gameId, userId]);

	const addExpansion = async (expansion) => {
		const { data, error } = await supabase
			.from("expansions")
			.insert({ ...expansion, game_id: gameId, user_id: userId })
			.select()
			.single();

		if (!error) setExpansions((prev) => [...prev, data]);
		return { error };
	};

	const removeExpansion = async (id) => {
		const { error } = await supabase
			.from("expansions")
			.delete()
			.eq("id", id)
			.eq("user_id", userId);

		if (!error) setExpansions((prev) => prev.filter((e) => e.id !== id));
		return { error };
	};

	const updateExpansion = async (id, updates) => {
		const { data, error } = await supabase
			.from("expansions")
			.update(updates)
			.eq("id", id)
			.eq("user_id", userId)
			.select()
			.single();

		if (!error)
			setExpansions((prev) => prev.map((e) => (e.id === id ? data : e)));
		return { error };
	};

	return {
		expansions,
		loading,
		addExpansion,
		removeExpansion,
		updateExpansion,
	};
};
