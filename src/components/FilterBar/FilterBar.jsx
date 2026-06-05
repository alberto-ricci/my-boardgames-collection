import React, { useState, useMemo, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../../i18n";
import SearchInput from "./SearchInput";
import CategoryPills from "./CategoryPills";
import GameCount from "./GameCount";

const SORT_OPTIONS_KEYS = [
	{ value: "default", key: "filter.sort.default" },
	{ value: "name-asc", key: "filter.sort.name_asc" },
	{ value: "name-desc", key: "filter.sort.name_desc" },
	{ value: "year-asc", key: "filter.sort.year_asc" },
	{ value: "year-desc", key: "filter.sort.year_desc" },
	{ value: "players-asc", key: "filter.sort.players_asc" },
	{ value: "players-desc", key: "filter.sort.players_desc" },
];

const sortGames = (games, sortBy) => {
	const sorted = [...games];
	switch (sortBy) {
		case "name-asc":
			return sorted.sort((a, b) => a.name.localeCompare(b.name));
		case "name-desc":
			return sorted.sort((a, b) => b.name.localeCompare(a.name));
		case "year-asc":
			return sorted.sort(
				(a, b) => (a.year_published ?? 0) - (b.year_published ?? 0),
			);
		case "year-desc":
			return sorted.sort(
				(a, b) => (b.year_published ?? 0) - (a.year_published ?? 0),
			);
		case "players-asc":
			return sorted.sort(
				(a, b) => (a.max_players ?? 0) - (b.max_players ?? 0),
			);
		case "players-desc":
			return sorted.sort(
				(a, b) => (b.max_players ?? 0) - (a.max_players ?? 0),
			);
		default:
			return sorted;
	}
};

const filterGames = (games, query, selectedCategories) => {
	const q = query.toLowerCase().trim();
	return games.filter((game) => {
		const matchesSearch =
			!q ||
			game.name?.toLowerCase().includes(q) ||
			game.description?.toLowerCase().includes(q) ||
			game.type?.toLowerCase().includes(q) ||
			game.categories?.some((cat) => cat.toLowerCase().includes(q));

		const matchesCategories =
			selectedCategories.length === 0 ||
			selectedCategories.every((cat) => game.categories?.includes(cat));

		return matchesSearch && matchesCategories;
	});
};

const FilterBar = ({ games = [], onFilter }) => {
	const { t } = useLanguage();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [sortBy, setSortBy] = useState("default");
	const [filteredCount, setFilteredCount] = useState(games.length);

	const categories = useMemo(() => {
		const counts = {};
		games.forEach((game) =>
			game.categories?.forEach((cat) => {
				counts[cat] = (counts[cat] || 0) + 1;
			}),
		);
		return Object.entries(counts)
			.map(([cat, count]) => ({ cat, count }))
			.sort((a, b) => a.cat.localeCompare(b.cat));
	}, [games]);

	const isActive =
		searchQuery.trim() !== "" ||
		selectedCategories.length > 0 ||
		sortBy !== "default";

	useEffect(() => {
		const filtered = filterGames(games, searchQuery, selectedCategories);
		const sorted = sortGames(filtered, sortBy);
		setFilteredCount(sorted.length);
		onFilter(sorted);
	}, [searchQuery, selectedCategories, sortBy, games]);

	const toggleCategory = useCallback((cat) => {
		setSelectedCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
		);
	}, []);

	const clearAll = useCallback(() => {
		setSearchQuery("");
		setSelectedCategories([]);
		setSortBy("default");
	}, []);

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
			<SearchInput
				value={searchQuery}
				onChange={setSearchQuery}
			/>

			<div className="flex items-start gap-2">
				<div className="flex-grow">
					<CategoryPills
						categories={categories}
						selected={selectedCategories}
						onToggle={toggleCategory}
					/>
				</div>
				{isActive && (
					<button
						onClick={clearAll}
						className="shrink-0 flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 active:text-red-800 mt-1 transition-colors duration-150 focus:outline-none"
					>
						<X className="w-3 h-3" />
						{t("filter.clear")}
					</button>
				)}
			</div>

			<div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
				<GameCount
					filtered={filteredCount}
					total={games.length}
				/>
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-colors duration-150 cursor-pointer"
				>
					{SORT_OPTIONS_KEYS.map((opt) => (
						<option
							key={opt.value}
							value={opt.value}
						>
							{t(opt.key)}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default FilterBar;
