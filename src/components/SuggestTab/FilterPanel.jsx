import React from "react";
import { Users, Tag } from "lucide-react";

const PLAYER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const Pill = ({ active, onClick, children }) => (
	<button
		onClick={onClick}
		className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
			active
				? "bg-blue-500 border-blue-500 text-white shadow-sm"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600"
		}`}
	>
		{children}
	</button>
);

const FilterSection = ({ icon: Icon, label, onClear, showClear, children }) => (
	<div>
		<div className="flex items-center gap-2 mb-2">
			<Icon className="w-3.5 h-3.5 text-gray-400" />
			<span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
				{label}
			</span>
			{showClear && (
				<button
					onClick={onClear}
					className="ml-auto text-xs text-gray-400 hover:text-red-400 transition-colors"
				>
					Clear
				</button>
			)}
		</div>
		{children}
	</div>
);

const FilterPanel = ({
	playerFilter,
	onTogglePlayer,
	onClearPlayer,
	categoryFilter,
	onToggleCategory,
	onClearCategory,
	allCategories,
	filteredCount,
}) => (
	<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
		<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
			Filters
		</p>

		<FilterSection
			icon={Users}
			label="Players"
			showClear={playerFilter !== null}
			onClear={onClearPlayer}
		>
			<div className="flex flex-wrap gap-2">
				{PLAYER_OPTIONS.map((n) => (
					<Pill
						key={n}
						active={playerFilter === n}
						onClick={() => onTogglePlayer(n)}
					>
						{n === 8 ? "8+" : n}
					</Pill>
				))}
			</div>
		</FilterSection>

		{allCategories.length > 0 && (
			<FilterSection
				icon={Tag}
				label="Category"
				showClear={categoryFilter !== null}
				onClear={onClearCategory}
			>
				<div className="flex flex-wrap gap-2">
					{allCategories.map((cat) => (
						<Pill
							key={cat}
							active={categoryFilter === cat}
							onClick={() => onToggleCategory(cat)}
						>
							{cat}
						</Pill>
					))}
				</div>
			</FilterSection>
		)}

		<p className="text-xs text-gray-400 dark:text-gray-500">
			{filteredCount} game{filteredCount !== 1 ? "s" : ""} match
			{filteredCount === 1 ? "es" : ""} your filters
		</p>
	</div>
);

export default FilterPanel;
