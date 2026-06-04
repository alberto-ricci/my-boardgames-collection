import React from "react";
import { useLanguage } from "../../i18n";

const GameCount = ({ filtered, total }) => {
	const { t } = useLanguage();
	const isFiltered = filtered !== total;

	return (
		<span className="text-sm text-gray-500 dark:text-gray-400">
			{isFiltered ? (
				<>
					<span className="font-medium text-gray-700 dark:text-gray-200">
						{filtered}
					</span>{" "}
					{t("count.of")}{" "}
					<span className="font-medium text-gray-700 dark:text-gray-200">
						{total}
					</span>{" "}
					{t("count.games")}
				</>
			) : (
				<>
					<span className="font-medium text-gray-700 dark:text-gray-200">
						{total}
					</span>{" "}
					{t("count.games")}
				</>
			)}
		</span>
	);
};

export default GameCount;
