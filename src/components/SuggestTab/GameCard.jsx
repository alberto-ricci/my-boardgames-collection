import React from "react";
import {
	Users,
	Clock,
	Calendar,
	Library,
	BookmarkCheck,
	RefreshCw,
} from "lucide-react";

const MetaPill = ({ icon: Icon, children }) => (
	<span className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 text-gray-600 dark:text-gray-300">
		<Icon className="w-3 h-3" />
		{children}
	</span>
);

const GameCard = ({ game, onReroll, isWishlist }) => {
	const playerLabel =
		game.min_players === game.max_players
			? `${game.min_players} players`
			: `${game.min_players}–${game.max_players} players`;

	const playtimeLabel =
		game.min_playtime &&
		game.max_playtime &&
		game.min_playtime !== game.max_playtime
			? `${game.min_playtime}–${game.max_playtime} min`
			: `${game.max_playtime || game.min_playtime} min`;

	return (
		<div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col gap-4">
			{/* Header row */}
			<div className="flex items-center justify-between">
				<span
					className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
						isWishlist
							? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
							: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
					}`}
				>
					{isWishlist ? (
						<BookmarkCheck className="w-3 h-3" />
					) : (
						<Library className="w-3 h-3" />
					)}
					{isWishlist ? "Wishlist" : "Collection"}
				</span>
				<button
					onClick={onReroll}
					className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
				>
					<RefreshCw className="w-3.5 h-3.5" />
					Re-roll
				</button>
			</div>

			{/* Title */}
			<div>
				<p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest font-medium">
					Play tonight
				</p>
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
					{game.name}
				</h2>
				{game.year_published && (
					<p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
						{game.year_published}
					</p>
				)}
			</div>

			{/* Meta pills */}
			<div className="flex flex-wrap gap-2">
				{game.min_players && game.max_players && (
					<MetaPill icon={Users}>{playerLabel}</MetaPill>
				)}
				{(game.min_playtime || game.max_playtime) && (
					<MetaPill icon={Clock}>{playtimeLabel}</MetaPill>
				)}
				{game.type && <MetaPill icon={Calendar}>{game.type}</MetaPill>}
			</div>

			{/* Categories */}
			{game.categories?.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{game.categories.map((cat) => (
						<span
							key={cat}
							className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md px-2 py-0.5 font-medium"
						>
							{cat}
						</span>
					))}
				</div>
			)}

			{/* Description */}
			{game.description && (
				<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
					{game.description}
				</p>
			)}
		</div>
	);
};

export default GameCard;
