import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const usePublicWishlist = (userId) => {
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) return;

		const fetch = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("wishlist")
				.select("*")
				.eq("user_id", userId);

			if (error) setError("Failed to load wishlist.");
			else setWishlist(data);
			setLoading(false);
		};

		fetch();
	}, [userId]);

	return { wishlist, loading, error };
};
