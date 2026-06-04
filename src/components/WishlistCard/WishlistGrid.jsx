import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import WishlistCard from "../WishlistCard/WishlistCard";
import { useLanguage } from "../../i18n/index.jsx";

const WishlistGrid = ({ games = [], onRemove, onMove }) => {
	const { t } = useLanguage();
	const validGames = games.filter((game) => game?.id && game?.name);

	if (validGames.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
				<div className="text-6xl mb-4">🎯</div>
				<h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-1">
					{t("empty.wishlist.title")}
				</h3>
				<p className="text-sm">{t("empty.wishlist.body")}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			<AnimatePresence mode="popLayout">
				{validGames.map((game) => (
					<motion.div
						key={game.id}
						layout
						initial={{ opacity: 0, scale: 0.97 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="relative"
					>
						<WishlistCard
							game={game}
							onMove={onMove}
						/>
						{onRemove && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									onRemove(game.id);
								}}
								className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-md p-1.5 transition-colors duration-200"
								aria-label={`Remove ${game.name} from wishlist`}
							>
								<X className="w-3.5 h-3.5" />
							</button>
						)}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

export default WishlistGrid;
