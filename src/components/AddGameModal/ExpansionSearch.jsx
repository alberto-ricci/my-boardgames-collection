import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 600;

const ExpansionSearch = ({ onSelect, inputClass }) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const debounceRef = useRef(null);
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			clearTimeout(debounceRef.current);
		};
	}, []);

	useEffect(() => {
		setError(null);

		if (!query.trim() || query.length < MIN_QUERY_LENGTH) {
			setResults([]);
			return;
		}

		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`/.netlify/functions/bgg-expansions?name=${encodeURIComponent(query)}`,
				);

				if (!res.ok)
					throw new Error(`Request failed with status ${res.status}`);

				const data = await res.json();
				if (!mountedRef.current) return;
				setResults(Array.isArray(data) ? data : []);
			} catch {
				if (!mountedRef.current) return;
				setError("Search failed.");
				setResults([]);
			} finally {
				if (mountedRef.current) setLoading(false);
			}
		}, DEBOUNCE_MS);

		return () => clearTimeout(debounceRef.current);
	}, [query]);

	const handleSelect = useCallback(
		(game) => {
			onSelect(game);
			setQuery("");
			setResults([]);
		},
		[onSelect],
	);

	return (
		<div className="relative">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search to auto-fill..."
					className={`${inputClass} pl-8`}
				/>
				{loading && (
					<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin pointer-events-none" />
				)}
			</div>

			{results.length > 0 && (
				<div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
					{results.map((game, index) => (
						<button
							key={game.bgg_id}
							type="button"
							onClick={() => handleSelect(game)}
							className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors duration-150 text-left ${
								index !== results.length - 1
									? "border-b border-gray-100 dark:border-gray-700"
									: ""
							}`}
						>
							<div className="min-w-0 flex-1">
								<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
									{game.name}
								</p>
								{game.year_published && (
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{game.year_published}
									</p>
								)}
							</div>
						</button>
					))}
				</div>
			)}

			{error && (
				<p className="text-xs text-red-500 dark:text-red-400 mt-1.5">
					{error}
				</p>
			)}
		</div>
	);
};

export default ExpansionSearch;
