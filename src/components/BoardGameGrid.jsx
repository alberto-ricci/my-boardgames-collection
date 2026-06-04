import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BoardGameCard from "./BoardGameCard/BoardGameCard";

const BoardGameGrid = ({ games = [], onRemove }) => {
	const validGames = games.filter((game) => game?.id && game?.name);

	if (validGames.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-gray-500">
				<div className="text-6xl mb-4">🎲</div>
				<h3 className="text-xl font-semibold mb-2">No games found</h3>
				<p className="text-gray-400">
					Your collection is empty or data couldn't be loaded.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
			<AnimatePresence mode="popLayout">
				{validGames.map((game) => (
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
								aria-label={`Remove ${game.name} from collection`}
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

export default BoardGameGrid;
