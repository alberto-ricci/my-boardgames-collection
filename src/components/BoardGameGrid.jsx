import { motion, AnimatePresence } from "framer-motion";
import BoardGameCard from "./BoardGameCard/BoardGameCard";

/**
 * BoardGameGrid - Displays a responsive grid of board game cards
 * with smooth animations when items are added or removed.
 */
const BoardGameGrid = ({ games = [], onRemove }) => {
	// Empty state
	if (!Array.isArray(games) || games.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-gray-500">
				<div className="text-6xl mb-4">🎲</div>
				<h3 className="text-xl font-semibold mb-2">No games found</h3>
				<p className="text-gray-400">
					Your collection is empty or data couldn’t be loaded.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
			<AnimatePresence mode="popLayout">
				{games.map((game) => {
					if (!game || !game.name) return null;

					return (
						<motion.div
							key={game.id}
							layout
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.25, ease: "easeInOut" }}
							className="relative"
						>
							<BoardGameCard game={game} />

							{onRemove && (
								<button
									onClick={() => onRemove(game.id)}
									className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
									title="Remove from collection"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							)}
						</motion.div>
					);
				})}
			</AnimatePresence>
		</div>
	);
};

export default BoardGameGrid;
