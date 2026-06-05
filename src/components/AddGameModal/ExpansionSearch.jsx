import React from "react";
import { Search, Loader2 } from "lucide-react";

const ExpansionSearch = ({ onSelect, inputClass }) => {
	const [query, setQuery] = React.useState("");
	const [results, setResults] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const debounceRef = React.useRef(null);

	React.useEffect(() => {
		if (!query.trim() || query.length < 3) {
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
				const data = await res.json();
				setResults(Array.isArray(data) ? data : []);
			} catch {
				setResults([]);
			}
			setLoading(false);
		}, 600);

		return () => clearTimeout(debounceRef.current);
	}, [query]);

	return (
		<div className="relative">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search to auto-fill..."
					className={`${inputClass} pl-8`}
				/>
				{loading && (
					<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin" />
				)}
			</div>

			{results.length > 0 && (
				<div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
					{results.map((game) => (
						<button
							key={game.bgg_id}
							type="button"
							onClick={() => {
								onSelect(game);
								setQuery("");
								setResults([]);
							}}
							className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
						>
							<div className="min-w-0">
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
		</div>
	);
};

export default ExpansionSearch;
