import { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
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

const LoadingScreen = ({ message }) => (
	<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
		<div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
			<Loader2 className="w-5 h-5 animate-spin" />
			<span className="text-sm">{message}</span>
		</div>
	</div>
);

const ErrorScreen = ({ message }) => (
	<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
		<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-6 py-4 max-w-sm text-center">
			<p className="text-red-600 dark:text-red-400 text-sm">{message}</p>
		</div>
	</div>
);

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

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [activeTab]);

	const handleAddSuccess = useCallback(
		(type, game, removedId) => {
			const actions = {
				collection: () => {
					addToCollectionState(game);
					addToast(t("toast.game_added"));
				},
				wishlist: () => {
					addToWishlistState(game);
					addToast(t("toast.wishlist_added"));
				},
				edit: () => {
					updateGame(game);
					addToast(t("toast.game_edited"));
				},
				move: () => {
					addToCollectionState(game);
					removeFromWishlistState(removedId);
					addToast(t("toast.game_moved"));
				},
			};
			actions[type]?.();
		},
		[
			addToCollectionState,
			addToWishlistState,
			updateGame,
			removeFromWishlistState,
			addToast,
			t,
		],
	);

	const handleRemoveFromCollection = useCallback(
		async (gameId) => {
			await removeFromCollection(gameId);
			addToast(t("toast.game_removed"));
		},
		[removeFromCollection, addToast, t],
	);

	const handleRemoveFromWishlist = useCallback(
		async (gameId) => {
			await removeFromWishlist(gameId);
			addToast(t("toast.game_removed"));
		},
		[removeFromWishlist, addToast, t],
	);

	const handleSelectGame = useCallback((game) => setSelectedGame(game), []);
	const handleCloseGame = useCallback(() => setSelectedGame(null), []);
	const handleEditGame = useCallback((game) => {
		setSelectedGame(null);
		setEditingGame(game);
	}, []);
	const handleOpenAdd = useCallback(() => setAddModalOpen(true), []);
	const handleCloseAdd = useCallback(() => setAddModalOpen(false), []);
	const handleCloseEdit = useCallback(() => setEditingGame(null), []);
	const handleCloseMove = useCallback(() => setMovingGame(null), []);
	const handleMove = useCallback((game) => setMovingGame(game), []);

	const {
		addToCollection,
		addToWishlist,
		editGame: submitEdit,
		moveToCollection,
	} = useAddGame(userId, handleAddSuccess);

	const existingCategories = useMemo(
		() =>
			[...new Set(collection.flatMap((g) => g.categories ?? []))].sort(),
		[collection],
	);

	const addModalMode = activeTab === "stats" ? "collection" : activeTab;
	const addModalSubmit =
		activeTab === "wishlist" ? addToWishlist : addToCollection;

	if (sessionLoading || profileLoading)
		return <LoadingScreen message={t("loading.generic")} />;
	if (!session) return <LoginPage />;
	if (!profile)
		return (
			<ProfilePage
				userId={userId}
				profile={null}
				updateProfile={updateProfile}
				isSetup
			/>
		);
	if (collectionLoading || wishlistLoading)
		return <LoadingScreen message={t("loading.collection")} />;
	if (collectionError || wishlistError)
		return <ErrorScreen message={collectionError || wishlistError} />;

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
								onSelect={handleSelectGame}
							/>
						</div>
					</>
				)}
				{activeTab === "wishlist" && (
					<WishlistGrid
						games={wishlist}
						onRemove={handleRemoveFromWishlist}
						onMove={handleMove}
					/>
				)}
				{activeTab === "stats" && <StatsTab collection={collection} />}
			</main>

			<AddGameButton onClick={handleOpenAdd} />
			<ScrollToTop />

			{addModalOpen && (
				<AddGameModal
					mode={addModalMode}
					onClose={handleCloseAdd}
					onSubmit={addModalSubmit}
					existingCategories={existingCategories}
				/>
			)}

			{editingGame && (
				<AddGameModal
					mode="edit"
					game={editingGame}
					onClose={handleCloseEdit}
					onSubmit={(form) => submitEdit(editingGame.id, form)}
					existingCategories={existingCategories}
				/>
			)}

			{movingGame && (
				<AddGameModal
					mode="move"
					game={movingGame}
					onClose={handleCloseMove}
					onSubmit={(form) => moveToCollection(movingGame, form)}
					existingCategories={existingCategories}
				/>
			)}

			<GameModal
				game={selectedGame}
				onClose={handleCloseGame}
				onEdit={handleEditGame}
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
