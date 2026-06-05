import React, { useCallback } from "react";
import { BookmarkCheck } from "lucide-react";
import { useLanguage } from "../../i18n";
import GameImage from "../BoardGameCard/GameImage";

const WishlistCard = ({ game, onMove }) => {
	const { t } = useLanguage();

	const handleMove = useCallback(
		(e) => {
			e.stopPropagation();
			onMove(game);
		},
		[onMove, game],
	);

	if (!game) return null;

	return (
		<article
			className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-full hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
			aria-label={`${game.name} wishlist card`}
		>
			<div className="overflow-hidden">
				<div className="transition-transform duration-300 group-hover:scale-105">
					<GameImage
						name={game.name}
						id={game.id}
					/>
				</div>
			</div>

			<div className="p-5 flex-grow flex items-center justify-between gap-3">
				<h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
					{game.name}
				</h3>
				{onMove && (
					<button
						onClick={handleMove}
						className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 active:text-blue-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
						aria-label={t("wishlist.move")}
					>
						<BookmarkCheck className="w-4 h-4 shrink-0" />
						<span className="hidden sm:inline">
							{t("wishlist.move")}
						</span>
					</button>
				)}
			</div>
		</article>
	);
};

export default WishlistCard;
