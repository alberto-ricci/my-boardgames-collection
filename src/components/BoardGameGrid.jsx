import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "../i18n";
import BoardGameCard from "./BoardGameCard/BoardGameCard";
import ConfirmModal from "./ConfirmModal/ConfirmModal";

const BoardGameGrid = ({ games = [], onRemove, onSelect }) => {
	const { t } = useLanguage();
	const [pendingRemove, setPendingRemove] = React.useState(null);

	const validGames = useMemo(
		() => games.filter((game) => game?.id && game?.name),
		[games],
	);

	const handleRemoveClick = useCallback((e, game) => {
		e.stopPropagation();
		setPendingRemove(game);
	}, []);

	const handleConfirm = useCallback(() => {
		if (!pendingRemove) return;
		onRemove(pendingRemove.id);
		setPendingRemove(null);
	}, [onRemove, pendingRemove]);

	const handleCancel = useCallback(() => setPendingRemove(null), []);

	if (validGames.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
				<div className="text-6xl mb-4">🎲</div>
				<h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-1">
					{t("empty.collection.title")}
				</h3>
				<p className="text-sm">{t("empty.collection.body")}</p>
			</div>
		);
	}

	return (
		<>
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
							<BoardGameCard
								game={game}
								onClick={() => onSelect?.(game)}
							/>
							{onRemove && (
								<button
									onClick={(e) => handleRemoveClick(e, game)}
									className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
									aria-label={`Remove ${game.name} from collection`}
								>
									<X className="w-3.5 h-3.5" />
								</button>
							)}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<ConfirmModal
				game={pendingRemove}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</>
	);
};

export default BoardGameGrid;
