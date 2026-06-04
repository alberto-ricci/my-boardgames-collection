import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const usePublicCollection = (userId) => {
	const [collection, setCollection] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) return;

		const fetch = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("games")
				.select("*")
				.eq("user_id", userId);

			if (error) setError("Failed to load collection.");
			else setCollection(data);
			setLoading(false);
		};

		fetch();
	}, [userId]);

	return { collection, loading, error };
};
