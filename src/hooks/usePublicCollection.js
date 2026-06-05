import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const usePublicCollection = (userId) => {
	const [collection, setCollection] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			return;
		}

		let mounted = true;

		const fetchPublicCollection = async () => {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("games")
				.select("*")
				.eq("user_id", userId)
				.order("name", { ascending: true });

			if (!mounted) return;

			if (error) {
				setError("Failed to load collection.");
			} else {
				setCollection(data ?? []);
			}

			setLoading(false);
		};

		fetchPublicCollection();

		return () => {
			mounted = false;
		};
	}, [userId]);

	return { collection, loading, error };
};
