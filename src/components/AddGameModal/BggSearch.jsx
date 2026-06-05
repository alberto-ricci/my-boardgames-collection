import React from "react";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { useBggSearch } from "../../hooks/useBggSearch";
import { useApiCounter } from "../../hooks/useApiCounter";

const BggSearch = ({ onSelect, inputClass }) => {
	const { query, setQuery, results, loading, error } = useBggSearch();
	const { isExhausted, isWarning, remaining } = useApiCounter();

	const exhausted = isExhausted();
	const warning = isWarning();
	const left = remaining();

	return (
		<div className="relative">
			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Search BoardGameGeek
			</label>

			{warning && !exhausted && (
				<div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mb-2">
					<AlertTriangle className="w-3.5 h-3.5 shrink-0" />
					Only {left} searches left this month.
				</div>
			)}

			{exhausted && (
				<div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-2">
					<AlertTriangle className="w-3.5 h-3.5 shrink-0" />
					Monthly search limit reached. Fill the form manually.
				</div>
			)}

			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={
						exhausted
							? "Search unavailable"
							: "Search and auto-fill..."
					}
					disabled={exhausted}
					className={`${inputClass} pl-9 ${exhausted ? "opacity-50 cursor-not-allowed" : ""}`}
				/>
				{loading && (
					<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
				)}
			</div>

			{results.length > 0 && (
				<>
					<div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
						{results.map((game) => (
							<button
								key={game.bgg_id}
								type="button"
								onClick={() => {
									onSelect(game);
									setQuery("");
								}}
								className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
							>
								{game.thumbnail ? (
									<img
										src={game.thumbnail}
										alt={game.name}
										className="w-10 h-10 rounded object-cover shrink-0"
									/>
								) : (
									<div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 shrink-0 flex items-center justify-center text-lg">
										🎲
									</div>
								)}
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
					<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
						Select a result to auto-fill the form
					</p>
				</>
			)}

			{error && !warning && (
				<p className="text-xs text-red-500 mt-1">{error}</p>
			)}
		</div>
	);
};

export default BggSearch;
