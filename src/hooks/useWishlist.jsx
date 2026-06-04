import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useWishlist = (userId) => {
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const addGame = (game) => {
		setWishlist((prev) => [...prev, game]);
	};
	const removeFromWishlistState = (gameId) => {
		setWishlist((prev) => prev.filter((g) => g.id !== gameId));
	};

	useEffect(() => {
		if (!userId) return;

		const fetchWishlist = async () => {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase.from("wishlist").select("*");

			if (error) {
				setError("Failed to load wishlist.");
			} else {
				setWishlist(data);
			}

			setLoading(false);
		};

		fetchWishlist();
	}, [userId]);

	const removeFromWishlist = async (gameId) => {
		const { error } = await supabase
			.from("wishlist")
			.delete()
			.eq("id", gameId)
			.eq("user_id", userId);
		if (!error) {
			setWishlist((prev) => prev.filter((game) => game.id !== gameId));
		}
	};

	return {
		wishlist,
		loading,
		error,
		removeFromWishlist,
		addGame,
		removeFromWishlistState,
	};
};
