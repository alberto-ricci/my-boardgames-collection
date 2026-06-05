import { useState, useMemo, useCallback } from "react";

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const useSuggestion = (collection, wishlist) => {
	const [source, setSource] = useState("collection");
	const [playerFilter, setPlayerFilter] = useState(null);
	const [categoryFilter, setCategoryFilter] = useState(null);
	const [suggested, setSuggested] = useState(null);
	const [noMatch, setNoMatch] = useState(false);
	const [lastMode, setLastMode] = useState(null);

	const pool = useMemo(() => {
		if (source === "collection")
			return collection.map((g) => ({ ...g, _isWishlist: false }));
		if (source === "wishlist")
			return wishlist.map((g) => ({ ...g, _isWishlist: true }));
		return [
			...collection.map((g) => ({ ...g, _isWishlist: false })),
			...wishlist.map((g) => ({ ...g, _isWishlist: true })),
		];
	}, [source, collection, wishlist]);

	const allCategories = useMemo(() => {
		const cats = new Set();
		pool.forEach((g) => g.categories?.forEach((c) => cats.add(c)));
		return [...cats].sort();
	}, [pool]);

	const filteredPool = useMemo(() => {
		return pool.filter((g) => {
			if (playerFilter !== null) {
				if (!g.min_players || !g.max_players) return false;
				if (
					playerFilter < g.min_players ||
					playerFilter > g.max_players
				)
					return false;
			}
			if (categoryFilter !== null) {
				if (!g.categories?.includes(categoryFilter)) return false;
			}
			return true;
		});
	}, [pool, playerFilter, categoryFilter]);

	const suggest = useCallback(
		(useFilters) => {
			const src = useFilters ? filteredPool : pool;
			if (src.length === 0) {
				setSuggested(null);
				setNoMatch(true);
			} else {
				setSuggested(pickRandom(src));
				setNoMatch(false);
			}
			setLastMode(useFilters ? "filtered" : "random");
		},
		[filteredPool, pool],
	);

	const reroll = useCallback(() => {
		suggest(lastMode === "filtered");
	}, [suggest, lastMode]);

	const changeSource = useCallback((value) => {
		setSource(value);
		setSuggested(null);
		setNoMatch(false);
	}, []);

	const togglePlayer = useCallback(
		(n) => setPlayerFilter((prev) => (prev === n ? null : n)),
		[],
	);

	const toggleCategory = useCallback(
		(cat) => setCategoryFilter((prev) => (prev === cat ? null : cat)),
		[],
	);

	return {
		source,
		changeSource,
		playerFilter,
		setPlayerFilter,
		togglePlayer,
		categoryFilter,
		setCategoryFilter,
		toggleCategory,
		pool,
		filteredPool,
		allCategories,
		suggested,
		noMatch,
		suggest,
		reroll,
	};
};
