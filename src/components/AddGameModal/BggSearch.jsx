import React from "react";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { useBggSearch } from "../../hooks/useBggSearch";
import { useApiCounter } from "../../hooks/useApiCounter";

const BggSearch = ({ onSelect, inputClass }) => {
	const { query, setQuery, results, loading, error, warning } =
		useBggSearch();
	const { isExhausted, remaining } = useApiCounter();

	const exhausted = isExhausted();
	const left = remaining();

	return (
		<div className="relative">
			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
				Search BoardGameGeek
			</label>

			{/* Warning banner */}
			{warning && !exhausted && (
				<div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mb-2">
					<AlertTriangle className="w-3.5 h-3.5 shrink-0" />
					{warning}
				</div>
			)}

			{/* Exhausted banner */}
			{exhausted && (
				<div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-2">
					<AlertTriangle className="w-3.5 h-3.5 shrink-0" />
					Monthly search limit reached. Fill the form manually.
				</div>
			)}

			{/* Input */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
					<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin pointer-events-none" />
				)}
			</div>

			{/* Results dropdown */}
			{results.length > 0 && (
				<div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
					{results.map((game, index) => (
						<button
							key={game.bgg_id}
							type="button"
							onClick={() => {
								onSelect(game);
								setQuery("");
							}}
							className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors duration-150 text-left ${
								index !== results.length - 1
									? "border-b border-gray-100 dark:border-gray-700"
									: ""
							}`}
						>
							{game.thumbnail ? (
								<img
									src={game.thumbnail}
									alt={game.name}
									className="w-9 h-9 rounded-md object-cover shrink-0"
								/>
							) : (
								<div className="w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700 shrink-0 flex items-center justify-center text-base">
									🎲
								</div>
							)}
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
					<p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
						Select a result to auto-fill the form
					</p>
				</div>
			)}

			{/* Error */}
			{error && (
				<p className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 mt-1.5">
					<AlertTriangle className="w-3.5 h-3.5 shrink-0" />
					{error}
				</p>
			)}
		</div>
	);
};

export default BggSearch;
