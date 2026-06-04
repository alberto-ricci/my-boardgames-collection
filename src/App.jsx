import { useState } from "react";
import Header from "./components/Header";
import NavTabs from "./components/NavTabs";
import BoardGameGrid from "./components/BoardGameGrid";
import gamesData from "./data/games.json";

function App() {
	const [collection, setCollection] = useState(gamesData || []);
	const [activeTab, setActiveTab] = useState("collection");

	const removeFromCollection = (gameId) => {
		setCollection((prev) => prev.filter((game) => game.id !== gameId));
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />
			<NavTabs
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

			<main className="flex-grow max-w-6xl mx-auto p-6">
				{activeTab === "collection" ? (
					<>
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							My Board Game Collection
						</h2>

						{collection.length === 0 ? (
							<EmptyState />
						) : (
							<BoardGameGrid
								games={collection}
								onRemove={removeFromCollection}
							/>
						)}
					</>
				) : (
					<div className="text-center text-gray-600">
						<p>Other sections coming soon!</p>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
