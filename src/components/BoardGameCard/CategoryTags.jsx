import React from "react";
import { useLanguage } from "../../i18n";

const CategoryTags = ({ categories = [] }) => {
	const { t } = useLanguage();
	const visible = categories.slice(0, 3);
	const remaining = categories.length - visible.length;

	return (
		<div className="flex flex-wrap gap-1.5">
			{visible.map((cat) => (
				<span
					key={cat}
					className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded"
				>
					{cat}
				</span>
			))}
			{remaining > 0 && (
				<span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded">
					+{remaining} {t("filter.show_more")}
				</span>
			)}
		</div>
	);
};

export default CategoryTags;
