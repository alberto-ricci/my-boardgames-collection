import React, { useCallback } from "react";
import { Layers } from "lucide-react";
import { useLanguage } from "../../i18n";
import GameImage from "./GameImage";
import GameInfo from "./GameInfo";
import CategoryTags from "./CategoryTags";

const BoardGameCard = ({ game, onClick }) => {
	const { t } = useLanguage();

	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick?.();
			}
		},
		[onClick],
	);

	if (!game) return null;

	return (
		<article
			onClick={onClick}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			role="button"
			className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
			aria-label={`${game.name} — ${t("modal.close")}`}
		>
			<div className="overflow-hidden">
				<div className="transition-transform duration-300 group-hover:scale-105">
					<GameImage
						name={game.name}
						id={game.id}
					/>
				</div>
			</div>

			<div className="p-5 flex flex-col flex-grow justify-between gap-4">
				<div className="space-y-3">
					<div>
						<h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
							{game.name}
						</h3>
						{game.expansion_count > 0 && (
							<span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
								<Layers className="w-3 h-3" />
								{game.expansion_count}{" "}
								{game.expansion_count === 1
									? t("expansions.expansion")
									: t("expansions.expansions")}
							</span>
						)}
					</div>
					<GameInfo
						min_players={game.min_players}
						max_players={game.max_players}
						min_playtime={game.min_playtime}
						max_playtime={game.max_playtime}
						year_published={game.year_published}
					/>
				</div>

				{game.categories?.length > 0 && (
					<CategoryTags categories={game.categories} />
				)}
			</div>
		</article>
	);
};

export default BoardGameCard;
