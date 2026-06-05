import React, { useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	Users,
	Clock,
	Calendar,
	Layers,
	Pencil,
	ExternalLink,
} from "lucide-react";
import { useLanguage } from "../../i18n";
import GameImage from "../BoardGameCard/GameImage";
import ExpansionsSection from "../AddGameModal/ExpansionsSection";
import { useExpansions } from "../../hooks/useExpansions";

const InfoRow = ({ icon: Icon, iconClass, children }) => (
	<span className="flex items-center gap-1.5">
		<Icon className={`w-4 h-4 shrink-0 ${iconClass}`} />
		{children}
	</span>
);

const GameModal = ({ game, onClose, onEdit, userId }) => {
	const { t } = useLanguage();
	const {
		expansions,
		loading: expansionsLoading,
		addExpansion,
		removeExpansion,
	} = useExpansions(game?.id, userId);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const handleEdit = useCallback(() => {
		onClose();
		onEdit(game);
	}, [onClose, onEdit, game]);

	const playerCount = useMemo(() => {
		const { min_players: min, max_players: max } = game ?? {};
		if (min == null && max == null) return "—";
		const label =
			min === 1 && max === 1 ? t("game.player") : t("game.players");
		if (min === max) return `${min} ${label}`;
		return `${min}–${max} ${label}`;
	}, [game, t]);

	const playtime = useMemo(() => {
		const { min_playtime: min, max_playtime: max } = game ?? {};
		if (min == null && max == null) return "—";
		if (min === max) return `${min} ${t("game.min")}`;
		return `${min}–${max} ${t("game.min")}`;
	}, [game, t]);

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
						initial={{ opacity: 0, scale: 0.97, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.97, y: 8 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						<div
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Image + action buttons */}
							<div className="relative">
								<GameImage
									name={game.name}
									id={game.id}
								/>
								<div className="absolute top-2 right-2 flex gap-1">
									{onEdit && (
										<button
											onClick={handleEdit}
											className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md p-1.5 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
											aria-label={t("edit.title")}
										>
											<Pencil className="w-4 h-4" />
										</button>
									)}
									<button
										onClick={onClose}
										className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-md p-1.5 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
										aria-label={t("modal.close")}
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="p-6 space-y-4">
								{/* Title + type */}
								<div>
									<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
										{game.name}
									</h2>
									{game.type && (
										<span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
											<Layers className="w-4 h-4 shrink-0" />
											{game.type}
										</span>
									)}
								</div>

								{/* Info row */}
								<div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
									<InfoRow
										icon={Users}
										iconClass="text-blue-500 dark:text-blue-400"
									>
										{playerCount}
									</InfoRow>
									<InfoRow
										icon={Clock}
										iconClass="text-emerald-500 dark:text-emerald-400"
									>
										{playtime}
									</InfoRow>
									{game.year_published && (
										<InfoRow
											icon={Calendar}
											iconClass="text-gray-400 dark:text-gray-500"
										>
											{game.year_published}
										</InfoRow>
									)}
								</div>

								{/* Description */}
								{game.description && (
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
										{game.description}
									</p>
								)}

								{/* Categories */}
								{game.categories?.length > 0 && (
									<div className="flex flex-wrap gap-1.5">
										{game.categories.map((cat) => (
											<span
												key={cat}
												className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-md"
											>
												{cat}
											</span>
										))}
									</div>
								)}

								{/* BGG link */}
								<a
									href={`https://boardgamegeek.com/search/boardgame?q=${encodeURIComponent(game.name)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
								>
									<ExternalLink className="w-3.5 h-3.5 shrink-0" />
									{t("modal.bgg_link")}
								</a>

								{/* Expansions */}
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
