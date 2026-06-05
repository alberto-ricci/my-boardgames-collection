import { useState, useEffect, useRef } from "react";
import { useApiCounter } from "./useApiCounter";

export const useBggSearch = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const debounceRef = useRef(null);
	const { increment, isExhausted, isWarning, remaining } = useApiCounter();

	useEffect(() => {
		if (!query.trim() || query.length < 3) {
			setResults([]);
			return;
		}

		if (isExhausted()) {
			setError("Monthly search limit reached. Add games manually.");
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
				increment();
				setResults(Array.isArray(data) ? data : []);

				if (isWarning()) {
					setError(
						`Warning: only ${remaining()} searches left this month.`,
					);
				}
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
