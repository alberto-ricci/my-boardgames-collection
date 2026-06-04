import React from "react";
import { BookmarkCheck } from "lucide-react";
import GameImage from "../BoardGameCard/GameImage";
import { useLanguage } from "../../i18n";

const WishlistCard = ({ game, onMove }) => {
	if (!game) return null;
	const { t } = useLanguage();

	return (
		<article
			className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-full"
			aria-label={`${game.name} wishlist card`}
		>
			<GameImage
				name={game.name}
				id={game.id}
			/>
			<div className="p-5 flex-grow flex items-center justify-between gap-3">
				<h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
					{game.name}
				</h3>
				{onMove && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onMove(game);
						}}
						className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150"
						aria-label={t("wishlist.move")}
					>
						<BookmarkCheck className="w-4 h-4" />
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
