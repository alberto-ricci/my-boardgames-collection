import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NavTabs from "./components/NavTabs";
import FilterBar from "./components/FilterBar/FilterBar";
import BoardGameGrid from "./components/BoardGameGrid";
import WishlistGrid from "./components/WishlistCard/WishlistGrid";
import GameModal from "./components/GameModal/GameModal";
import AddGameModal from "./components/AddGameModal/AddGameModal";
import AddGameButton from "./components/AddGameModal/AddGameButton";
import LoginPage from "./components/LoginPage/LoginPage";
import SharedView from "./components/SharedView/SharedView";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import StatsTab from "./components/StatsTab/StatsTab";
import ToastContainer from "./components/Toast/ToastContainer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { useAuth } from "./hooks/useAuth";
import { useCollection } from "./hooks/useCollection";
import { useWishlist } from "./hooks/useWishlist";
import { useProfile } from "./hooks/useProfile";
import { useAddGame } from "./hooks/useAddGame";
import { useDarkMode } from "./hooks/useDarkMode";
import { useToast } from "./hooks/useToast";
import { useLanguage } from "./i18n";

function CollectionApp() {
	const { isDark, toggle: toggleDark } = useDarkMode();
	const { session, loading: sessionLoading } = useAuth();
	const { t } = useLanguage();
	const userId = session?.user?.id;
	const { toasts, addToast, removeToast } = useToast();

	const {
		profile,
		loading: profileLoading,
		updateProfile,
	} = useProfile(userId);
	const {
		collection,
		filteredGames,
		setFilteredGames,
		loading: collectionLoading,
		error: collectionError,
		removeFromCollection,
		addGame: addToCollectionState,
		updateGame,
	} = useCollection(userId);
	const {
		wishlist,
		loading: wishlistLoading,
		error: wishlistError,
		removeFromWishlist,
		addGame: addToWishlistState,
		removeFromWishlistState,
	} = useWishlist(userId);

	const [activeTab, setActiveTab] = useState("collection");
	const [selectedGame, setSelectedGame] = useState(null);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editingGame, setEditingGame] = useState(null);
	const [movingGame, setMovingGame] = useState(null);

	// Scroll to top on tab change
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [activeTab]);

	const handleAddSuccess = (type, game, removedId) => {
		if (type === "collection") {
			addToCollectionState(game);
			addToast(t("toast.game_added"));
		} else if (type === "wishlist") {
			addToWishlistState(game);
			addToast(t("toast.wishlist_added"));
		} else if (type === "edit") {
			updateGame(game);
			addToast(t("toast.game_edited"));
		} else if (type === "move") {
			addToCollectionState(game);
			removeFromWishlistState(removedId);
			addToast(t("toast.game_moved"));
		}
	};

	const handleRemoveFromCollection = async (gameId) => {
		await removeFromCollection(gameId);
		addToast(t("toast.game_removed"));
	};

	const handleRemoveFromWishlist = async (gameId) => {
		await removeFromWishlist(gameId);
		addToast(t("toast.game_removed"));
	};

	const {
		addToCollection,
		addToWishlist,
		editGame: submitEdit,
		moveToCollection,
	} = useAddGame(userId, handleAddSuccess);

	const existingCategories = [
		...new Set(collection.flatMap((g) => g.categories ?? [])),
	].sort();

	if (sessionLoading || profileLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-gray-500 text-sm">{t("loading.generic")}</p>
			</div>
		);
	}

	if (!session) return <LoginPage />;

	if (!profile) {
		return (
			<ProfilePage
				userId={userId}
				profile={null}
				updateProfile={updateProfile}
				isSetup
			/>
		);
	}

	if (collectionLoading || wishlistLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-gray-500 text-sm">
					{t("loading.collection")}
				</p>
			</div>
		);
	}

	if (collectionError || wishlistError) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-red-500 text-sm">
					{collectionError || wishlistError}
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
			<Header
				userId={userId}
				activeTab={activeTab}
				profile={profile}
				isDark={isDark}
				onToggleDark={toggleDark}
			/>
			<NavTabs
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

			<main className="flex-grow max-w-6xl mx-auto w-full p-6">
				{activeTab === "collection" && (
					<>
						<FilterBar
							games={collection}
							onFilter={setFilteredGames}
						/>
						<div className="mt-6">
							<BoardGameGrid
								games={filteredGames}
								onRemove={handleRemoveFromCollection}
								onSelect={setSelectedGame}
							/>
						</div>
					</>
				)}
				{activeTab === "wishlist" && (
					<WishlistGrid
						games={wishlist}
						onRemove={handleRemoveFromWishlist}
						onMove={(game) => setMovingGame(game)}
					/>
				)}
				{activeTab === "stats" && <StatsTab collection={collection} />}
			</main>

			<AddGameButton onClick={() => setAddModalOpen(true)} />
			<ScrollToTop />

			{addModalOpen && (
				<AddGameModal
					mode={activeTab === "stats" ? "collection" : activeTab}
					onClose={() => setAddModalOpen(false)}
					onSubmit={
						activeTab === "wishlist"
							? addToWishlist
							: addToCollection
					}
					existingCategories={existingCategories}
				/>
			)}

			{editingGame && (
				<AddGameModal
					mode="edit"
					game={editingGame}
					onClose={() => setEditingGame(null)}
					onSubmit={(form) => submitEdit(editingGame.id, form)}
					existingCategories={existingCategories}
				/>
			)}

			{movingGame && (
				<AddGameModal
					mode="move"
					game={movingGame}
					onClose={() => setMovingGame(null)}
					onSubmit={(form) => moveToCollection(movingGame, form)}
					existingCategories={existingCategories}
				/>
			)}

			<GameModal
				game={selectedGame}
				onClose={() => setSelectedGame(null)}
				onEdit={(game) => {
					setSelectedGame(null);
					setEditingGame(game);
				}}
				userId={userId}
			/>

			<ToastContainer
				toasts={toasts}
				onRemove={removeToast}
			/>
		</div>
	);
}

function ProfilePageWrapper() {
	const { session } = useAuth();
	const userId = session?.user?.id;
	const { profile, updateProfile } = useProfile(userId);

	return (
		<ProfilePage
			userId={userId}
			profile={profile}
			updateProfile={updateProfile}
			isSetup={false}
		/>
	);
}

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={<CollectionApp />}
			/>
			<Route
				path="/share/:userId"
				element={<SharedView />}
			/>
			<Route
				path="/profile"
				element={<ProfilePageWrapper />}
			/>
		</Routes>
	);
}

export default App;
