import { useState, useEffect, useRef } from "react";

export const useBggSearch = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const debounceRef = useRef(null);

	useEffect(() => {
		if (!query.trim() || query.length < 3) {
			setResults([]);
			return;
		}

		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			setLoading(true);
			setError(null);

			try {
				const res = await fetch(
					`/.netlify/functions/bgg-search?name=${encodeURIComponent(query)}`,
				);
				const data = await res.json();
				setResults(Array.isArray(data) ? data : []);
			} catch (err) {
				setError("Search failed.");
				setResults([]);
			}

			setLoading(false);
		}, 600);

		return () => clearTimeout(debounceRef.current);
	}, [query]);

	return { query, setQuery, results, loading, error };
};
