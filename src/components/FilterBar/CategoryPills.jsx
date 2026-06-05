import React, { useMemo, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../../i18n";

const MIN_COUNT = 3;

const CategoryPills = ({ categories, selected, onToggle }) => {
	const { t } = useLanguage();
	const [showAll, setShowAll] = React.useState(false);

	const { common, rest, visible } = useMemo(() => {
		const common = categories.filter((c) => c.count >= MIN_COUNT);
		const rest = categories.filter((c) => c.count < MIN_COUNT);
		return { common, rest, visible: showAll ? categories : common };
	}, [categories, showAll]);

	const toggleShowAll = useCallback(() => setShowAll((prev) => !prev), []);

	return (
		<div className="flex flex-wrap gap-2 items-center">
			{visible.map(({ cat }) => {
				const isSelected = selected.includes(cat);
				return (
					<button
						key={cat}
						onClick={() => onToggle(cat)}
						className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 ${
							isSelected
								? "bg-blue-500 dark:bg-blue-600 text-white shadow-sm"
								: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500"
						}`}
						aria-pressed={isSelected}
					>
						{cat}
					</button>
				);
			})}

			{rest.length > 0 && (
				<button
					onClick={toggleShowAll}
					className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
				>
					{showAll ? (
						<>
							<ChevronUp className="w-3 h-3" />
							{t("filter.show_less")}
						</>
					) : (
						<>
							<ChevronDown className="w-3 h-3" />
							{rest.length} {t("filter.show_more")}
						</>
					)}
				</button>
			)}
		</div>
	);
};

export default CategoryPills;
