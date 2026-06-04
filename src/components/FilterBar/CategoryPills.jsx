import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../../i18n";

const MIN_COUNT = 3;

const CategoryPills = ({ categories, selected, onToggle }) => {
	const { t } = useLanguage();
	const [showAll, setShowAll] = React.useState(false);

	const common = categories.filter((c) => c.count >= MIN_COUNT);
	const rest = categories.filter((c) => c.count < MIN_COUNT);
	const visible = showAll ? categories : common;

	return (
		<div className="flex flex-wrap gap-2 items-center">
			{visible.map(({ cat }) => (
				<button
					key={cat}
					onClick={() => onToggle(cat)}
					className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
						selected.includes(cat)
							? "bg-blue-500 dark:bg-blue-600 text-white"
							: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
					}`}
				>
					{cat}
				</button>
			))}
			{rest.length > 0 && (
				<button
					onClick={() => setShowAll((prev) => !prev)}
					className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-150"
				>
					{showAll ? (
						<>
							<ChevronUp className="w-3 h-3" />{" "}
							{t("filter.show_less")}
						</>
					) : (
						<>
							<ChevronDown className="w-3 h-3" /> {rest.length}{" "}
							{t("filter.show_more")}
						</>
					)}
				</button>
			)}
		</div>
	);
};

export default CategoryPills;
