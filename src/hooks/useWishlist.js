import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export const useWishlist = (userId) => {
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			return;
		}

		let mounted = true;

		const fetchWishlist = async () => {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("wishlist")
				.select("*")
				.eq("user_id", userId)
				.order("name", { ascending: true });

			if (!mounted) return;

			if (error) {
				setError("Failed to load wishlist.");
			} else {
				setWishlist(data ?? []);
			}

			setLoading(false);
		};

		fetchWishlist();

		return () => {
			mounted = false;
		};
	}, [userId]);

	const addGame = useCallback((game) => {
		setWishlist((prev) =>
			[...prev, game].sort((a, b) => a.name.localeCompare(b.name)),
		);
	}, []);

	const removeFromWishlist = useCallback(
		async (gameId) => {
			const { error } = await supabase
				.from("wishlist")
				.delete()
				.eq("id", gameId)
				.eq("user_id", userId);

			if (!error) {
				setWishlist((prev) => prev.filter((g) => g.id !== gameId));
			}
		},
		[userId],
	);

	const removeFromWishlistState = useCallback((gameId) => {
		setWishlist((prev) => prev.filter((g) => g.id !== gameId));
	}, []);

	return {
		wishlist,
		loading,
		error,
		removeFromWishlist,
		addGame,
		removeFromWishlistState,
	};
};
