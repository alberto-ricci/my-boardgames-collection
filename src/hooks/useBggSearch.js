import { useState, useEffect, useRef, useCallback } from "react";
import { useApiCounter } from "./useApiCounter";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 600;

export const useBggSearch = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [warning, setWarning] = useState(null);
	const debounceRef = useRef(null);
	const { increment, isExhausted, isWarning, remaining } = useApiCounter();

	useEffect(() => {
		setError(null);
		setWarning(null);

		if (!query.trim() || query.length < MIN_QUERY_LENGTH) {
			setResults([]);
			return;
		}

		if (isExhausted()) {
			setError("Monthly search limit reached. Add games manually.");
			setResults([]);
			return;
		}

		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			setLoading(true);

			try {
				const res = await fetch(
					`/.netlify/functions/bgg-search?name=${encodeURIComponent(query)}`,
				);

				if (!res.ok) {
					throw new Error(`Request failed with status ${res.status}`);
				}

				const data = await res.json();
				const games = Array.isArray(data) ? data : [];

				increment();
				setResults(games);

				if (isWarning()) {
					setWarning(`Only ${remaining()} searches left this month.`);
				}
			} catch (err) {
				setError("Search failed. Please try again.");
				setResults([]);
			} finally {
				setLoading(false);
			}
		}, DEBOUNCE_MS);

		return () => clearTimeout(debounceRef.current);
	}, [query]);

	const clearResults = useCallback(() => {
		setQuery("");
		setResults([]);
		setError(null);
		setWarning(null);
	}, []);

	return { query, setQuery, results, loading, error, warning, clearResults };
};
