import { supabase } from "../lib/supabase";

export const useAddGame = (userId, onSuccess) => {
	const generateId = (name) =>
		name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

	const addToCollection = async (formData) => {
		const id = generateId(formData.name);
		const { data, error } = await supabase
			.from("games")
			.insert({
				id,
				name: formData.name.trim(),
				type: formData.type?.trim() || null,
				min_players: formData.min_players
					? parseInt(formData.min_players)
					: null,
				max_players: formData.max_players
					? parseInt(formData.max_players)
					: null,
				min_playtime: formData.min_playtime
					? parseInt(formData.min_playtime)
					: null,
				max_playtime: formData.max_playtime
					? parseInt(formData.max_playtime)
					: null,
				year_published: formData.year_published
					? parseInt(formData.year_published)
					: null,
				categories:
					formData.categories?.length > 0
						? formData.categories
						: null,
				description: formData.description?.trim() || null,
				user_id: userId,
			})
			.select()
			.single();

		if (!error) onSuccess?.("collection", data);
		return { error };
	};

	const addToWishlist = async (formData) => {
		const id = generateId(formData.name);
		const { data, error } = await supabase
			.from("wishlist")
			.insert({ id, name: formData.name.trim(), user_id: userId })
			.select()
			.single();

		if (!error) onSuccess?.("wishlist", data);
		return { error };
	};

	const editGame = async (gameId, formData) => {
		const { data, error } = await supabase
			.from("games")
			.update({
				name: formData.name.trim(),
				type: formData.type?.trim() || null,
				min_players: formData.min_players
					? parseInt(formData.min_players)
					: null,
				max_players: formData.max_players
					? parseInt(formData.max_players)
					: null,
				min_playtime: formData.min_playtime
					? parseInt(formData.min_playtime)
					: null,
				max_playtime: formData.max_playtime
					? parseInt(formData.max_playtime)
					: null,
				year_published: formData.year_published
					? parseInt(formData.year_published)
					: null,
				categories:
					formData.categories?.length > 0
						? formData.categories
						: null,
				description: formData.description?.trim() || null,
			})
			.eq("id", gameId)
			.eq("user_id", userId)
			.select()
			.single();

		if (!error) onSuccess?.("edit", data);
		return { error };
	};

	const moveToCollection = async (wishlistGame, formData) => {
		const id = generateId(formData.name);

		const { data, error } = await supabase
			.from("games")
			.insert({
				id,
				name: formData.name.trim(),
				type: formData.type?.trim() || null,
				min_players: formData.min_players
					? parseInt(formData.min_players)
					: null,
				max_players: formData.max_players
					? parseInt(formData.max_players)
					: null,
				min_playtime: formData.min_playtime
					? parseInt(formData.min_playtime)
					: null,
				max_playtime: formData.max_playtime
					? parseInt(formData.max_playtime)
					: null,
				year_published: formData.year_published
					? parseInt(formData.year_published)
					: null,
				categories:
					formData.categories?.length > 0
						? formData.categories
						: null,
				description: formData.description?.trim() || null,
				user_id: userId,
			})
			.select()
			.single();

		if (!error) {
			await supabase
				.from("wishlist")
				.delete()
				.eq("id", wishlistGame.id)
				.eq("user_id", userId);

			onSuccess?.("move", data, wishlistGame.id);
		}

		return { error };
	};

	return { addToCollection, addToWishlist, editGame, moveToCollection };
};
