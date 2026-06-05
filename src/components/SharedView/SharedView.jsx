import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { usePublicCollection } from "../../hooks/usePublicCollection";
import { usePublicWishlist } from "../../hooks/usePublicWishlist";
import { useLanguage } from "../../i18n";
import BoardGameGrid from "../BoardGameGrid";
import WishlistGrid from "../WishlistCard/WishlistGrid";
import FilterBar from "../FilterBar/FilterBar";
import GameModal from "../GameModal/GameModal";

const SharedView = () => {
	const { userId } = useParams();
	const [searchParams] = useSearchParams();
	const { t } = useLanguage();

	const type = useMemo(
		() => searchParams.get("type") || "collection",
		[searchParams],
	);

	const { collection, loading: collectionLoading } =
		usePublicCollection(userId);
	const { wishlist, loading: wishlistLoading } = usePublicWishlist(userId);

	const [owner, setOwner] = useState(null);
	const [filteredGames, setFilteredGames] = useState([]);
	const [selectedGame, setSelectedGame] = useState(null);

	useEffect(() => {
		setFilteredGames(collection);
	}, [collection]);

	useEffect(() => {
		if (!userId) return;

		let mounted = true;

		supabase
			.from("profiles")
			.select("username, avatar_url")
			.eq("id", userId)
			.single()
			.then(({ data }) => {
				if (mounted) setOwner(data);
			});

		return () => {
			mounted = false;
		};
	}, [userId]);

	const handleCloseModal = useCallback(() => setSelectedGame(null), []);

	const title = useMemo(() => {
		const section =
			type === "wishlist" ? t("shared.wishlist") : t("shared.collection");
		return owner?.username ? `${owner.username}'s ${section}` : section;
	}, [owner, type, t]);

	if (collectionLoading || wishlistLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
					<Loader2 className="w-5 h-5 animate-spin" />
					<span className="text-sm">{t("loading.shared")}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
			{/* Header */}
			<header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
					{owner?.avatar_url ? (
						<img
							src={owner.avatar_url}
							alt={owner.username}
							className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-700 shrink-0"
						/>
					) : (
						<div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl shrink-0">
							🎲
						</div>
					)}
					<div className="min-w-0">
						<h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
							{title}
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t("shared.readonly")}
						</p>
					</div>
				</div>
			</header>

			{/* Content */}
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

			{/* CTA banner */}
			<div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800 py-10 px-4 text-center">
				<p className="text-gray-700 dark:text-gray-200 font-semibold mb-1.5">
					{t("shared.cta.title")}
				</p>
				<p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
					{t("shared.cta.body")}
				</p>
				<Link
					to="/"
					className="inline-block bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
				>
					{t("shared.cta.button")}
				</Link>
			</div>

			<GameModal
				game={selectedGame}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default SharedView;
