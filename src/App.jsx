import { useState } from "react";
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
import { useAuth } from "./hooks/useAuth";
import { useCollection } from "./hooks/useCollection";
import { useWishlist } from "./hooks/useWishlist";
import { useProfile } from "./hooks/useProfile";
import { useAddGame } from "./hooks/useAddGame";
import { useDarkMode } from "./hooks/useDarkMode";

function CollectionApp() {
	const { isDark, toggle: toggleDark } = useDarkMode();
	const { session, loading: sessionLoading } = useAuth();
	const userId = session?.user?.id;

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

	const handleAddSuccess = (type, game, removedId) => {
		if (type === "collection") addToCollectionState(game);
		else if (type === "wishlist") addToWishlistState(game);
		else if (type === "edit") updateGame(game);
		else if (type === "move") {
			addToCollectionState(game);
			removeFromWishlistState(removedId);
		}
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
				<p className="text-gray-500 text-sm">Loading...</p>
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
					Loading your collection...
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
				{activeTab === "collection" ? (
					<>
						<FilterBar
							games={collection}
							onFilter={setFilteredGames}
						/>
						<div className="mt-6">
							<BoardGameGrid
								games={filteredGames}
								onRemove={removeFromCollection}
								onSelect={setSelectedGame}
							/>
						</div>
					</>
				) : (
					<WishlistGrid
						games={wishlist}
						onRemove={removeFromWishlist}
						onMove={(game) => setMovingGame(game)}
					/>
				)}
			</main>

			<AddGameButton onClick={() => setAddModalOpen(true)} />

			{/* Add modal */}
			{addModalOpen && (
				<AddGameModal
					mode={activeTab}
					onClose={() => setAddModalOpen(false)}
					onSubmit={
						activeTab === "collection"
							? addToCollection
							: addToWishlist
					}
					existingCategories={existingCategories}
				/>
			)}

			{/* Edit modal */}
			{editingGame && (
				<AddGameModal
					mode="edit"
					game={editingGame}
					onClose={() => setEditingGame(null)}
					onSubmit={(form) => submitEdit(editingGame.id, form)}
					existingCategories={existingCategories}
				/>
			)}

			{/* Move to collection modal */}
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
