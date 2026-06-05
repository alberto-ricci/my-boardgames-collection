import React, { useMemo } from "react";
import { useLanguage } from "../../i18n";

const MAX_VISIBLE = 3;

const CategoryTags = ({ categories = [] }) => {
	const { t } = useLanguage();

	const { visible, remaining } = useMemo(
		() => ({
			visible: categories.slice(0, MAX_VISIBLE),
			remaining: Math.max(0, categories.length - MAX_VISIBLE),
		}),
		[categories],
	);

	if (categories.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-1.5">
			{visible.map((cat) => (
				<span
					key={cat}
					className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-md"
				>
					{cat}
				</span>
			))}
			{remaining > 0 && (
				<span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
					+{remaining} {t("filter.show_more")}
				</span>
			)}
		</div>
	);
};

export default CategoryTags;
