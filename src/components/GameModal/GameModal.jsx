import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Clock, Calendar, Layers, Pencil } from "lucide-react";
import GameImage from "../BoardGameCard/GameImage";
import { useLanguage } from "../../i18n";
import ExpansionsSection from "../AddGameModal/ExpansionsSection";
import { useExpansions } from "../../hooks/useExpansions";
const GameModal = ({ game, onClose, onEdit, userId }) => {
	const { t } = useLanguage();
	const {
		expansions,
		loading: expansionsLoading,
		addExpansion,
		removeExpansion,
	} = useExpansions(game?.id, userId);

	React.useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const formatPlayerCount = (min, max) => {
		if (min == null && max == null) return "—";
		const label =
			min === 1 && max === 1 ? t("game.player") : t("game.players");
		if (min === max) return `${min} ${label}`;
		return `${min}–${max} ${label}`;
	};

	const formatPlaytime = (min, max) => {
		if (min == null && max == null) return "—";
		if (min === max) return `${min} ${t("game.min")}`;
		return `${min}–${max} ${t("game.min")}`;
	};

	return (
		<AnimatePresence>
			{game && (
				<>
					<motion.div
						className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
						initial={{ opacity: 0, scale: 0.97 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.97 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						<div
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Image + buttons */}
							<div className="relative">
								<GameImage
									name={game.name}
									id={game.id}
								/>
								<div className="absolute top-2 right-2 flex gap-1">
									{onEdit && (
										<button
											onClick={() => {
												onClose();
												onEdit(game);
											}}
											className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-md p-1.5 transition-colors duration-150 hover:bg-white dark:hover:bg-gray-700"
											aria-label={t("edit.title")}
										>
											<Pencil className="w-4 h-4" />
										</button>
									)}
									<button
										onClick={onClose}
										className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-md p-1.5 transition-colors duration-150 hover:bg-white dark:hover:bg-gray-700"
										aria-label={t("modal.close")}
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="p-6 space-y-4">
								<div>
									<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
										{game.name}
									</h2>
									{game.type && (
										<span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
											<Layers className="w-4 h-4" />
											{game.type}
										</span>
									)}
								</div>

								<div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
									<span className="flex items-center gap-1.5">
										<Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
										{formatPlayerCount(
											game.min_players,
											game.max_players,
										)}
									</span>
									<span className="flex items-center gap-1.5">
										<Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
										{formatPlaytime(
											game.min_playtime,
											game.max_playtime,
										)}
									</span>
									{game.year_published && (
										<span className="flex items-center gap-1.5">
											<Calendar className="w-4 h-4 text-gray-400" />
											{game.year_published}
										</span>
									)}
								</div>

								{game.description && (
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
										{game.description}
									</p>
								)}

								{game.categories?.length > 0 && (
									<div className="flex flex-wrap gap-1.5">
										{game.categories.map((cat) => (
											<span
												key={cat}
												className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded"
											>
												{cat}
											</span>
										))}
									</div>
								)}

								<ExpansionsSection
									gameId={game?.id}
									userId={userId}
									expansions={expansions}
									loading={expansionsLoading}
									onAdd={addExpansion}
									onRemove={removeExpansion}
								/>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default GameModal;
