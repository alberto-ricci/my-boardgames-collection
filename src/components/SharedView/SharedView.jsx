import React from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { usePublicCollection } from "../../hooks/usePublicCollection";
import { usePublicWishlist } from "../../hooks/usePublicWishlist";
import { supabase } from "../../lib/supabase";
import BoardGameGrid from "../BoardGameGrid";
import WishlistGrid from "../WishlistCard/WishlistGrid";
import FilterBar from "../FilterBar/FilterBar";
import GameModal from "../GameModal/GameModal";
import { useLanguage } from "../../i18n/index.jsx";

const SharedView = () => {
	const { userId } = useParams();
	const [searchParams] = useSearchParams();
	const { t } = useLanguage();
	const type = searchParams.get("type") || "collection";

	const { collection, loading: collectionLoading } =
		usePublicCollection(userId);
	const { wishlist, loading: wishlistLoading } = usePublicWishlist(userId);
	const [owner, setOwner] = React.useState(null);
	const [filteredGames, setFilteredGames] = React.useState([]);
	const [selectedGame, setSelectedGame] = React.useState(null);

	React.useEffect(() => {
		setFilteredGames(collection);
	}, [collection]);

	React.useEffect(() => {
		if (!userId) return;
		supabase
			.from("profiles")
			.select("username, avatar_url")
			.eq("id", userId)
			.single()
			.then(({ data }) => setOwner(data));
	}, [userId]);

	if (collectionLoading || wishlistLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-gray-500 dark:text-gray-400 text-sm">
					{t("loading.shared")}
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
			<header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
					{owner?.avatar_url ? (
						<img
							src={owner.avatar_url}
							alt={owner.username}
							className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-gray-700"
						/>
					) : (
						<div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
							🎲
						</div>
					)}
					<div>
						<h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
							{owner?.username
								? `${owner.username}'s ${type === "wishlist" ? t("shared.wishlist") : t("shared.collection")}`
								: type === "wishlist"
									? t("shared.wishlist")
									: t("shared.collection")}
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t("shared.readonly")}
						</p>
					</div>
				</div>
			</header>

			<main className="flex-grow max-w-6xl mx-auto w-full p-6">
				{type === "wishlist" ? (
					<WishlistGrid games={wishlist} />
				) : (
					<>
						<FilterBar
							games={collection}
							onFilter={setFilteredGames}
						/>
						<div className="mt-6">
							<BoardGameGrid
								games={filteredGames}
								onSelect={setSelectedGame}
							/>
						</div>
					</>
				)}
			</main>

			<div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800 py-8 px-4 text-center">
				<p className="text-gray-700 dark:text-gray-200 font-medium mb-1">
					{t("shared.cta.title")}
				</p>
				<p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
					{t("shared.cta.body")}
				</p>
				<Link
					to="/"
					className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors duration-200"
				>
					{t("shared.cta.button")}
				</Link>
			</div>

			<GameModal
				game={selectedGame}
				onClose={() => setSelectedGame(null)}
			/>
		</div>
	);
};

export default SharedView;
