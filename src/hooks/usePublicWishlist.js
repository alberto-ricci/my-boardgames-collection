import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const usePublicWishlist = (userId) => {
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			return;
		}

		let mounted = true;

		const fetchPublicWishlist = async () => {
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

		fetchPublicWishlist();

		return () => {
			mounted = false;
		};
	}, [userId]);

	return { wishlist, loading, error };
};
