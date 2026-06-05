import React from "react";
import { useSuggestion } from "../../hooks/useSuggestion";
import SourceToggle from "./SourceToggle";
import FilterPanel from "./FilterPanel";
import ActionButtons from "./ActionButtons";
import GameCard from "./GameCard";
import EmptyState from "./EmptyState";

const SuggestTab = ({ collection = [], wishlist = [] }) => {
	const {
		source,
		changeSource,
		playerFilter,
		togglePlayer,
		setPlayerFilter,
		categoryFilter,
		toggleCategory,
		setCategoryFilter,
		filteredPool,
		allCategories,
		suggested,
		noMatch,
		suggest,
		reroll,
	} = useSuggestion(collection, wishlist);

	if (collection.length === 0 && wishlist.length === 0) {
		return (
			<EmptyState message="Add some games to your collection or wishlist first." />
		);
	}

	return (
		<div className="space-y-6">
			<SourceToggle
				source={source}
				onChange={changeSource}
				collectionCount={collection.length}
				wishlistCount={wishlist.length}
			/>

			<FilterPanel
				playerFilter={playerFilter}
				onTogglePlayer={togglePlayer}
				onClearPlayer={() => setPlayerFilter(null)}
				categoryFilter={categoryFilter}
				onToggleCategory={toggleCategory}
				onClearCategory={() => setCategoryFilter(null)}
				allCategories={allCategories}
				filteredCount={filteredPool.length}
			/>

			<ActionButtons
				onSuggest={() => suggest(true)}
				onSurprise={() => suggest(false)}
				disabled={filteredPool.length === 0}
			/>

			{suggested && (
				<GameCard
					game={suggested}
					onReroll={reroll}
					isWishlist={suggested._isWishlist}
				/>
			)}

			{noMatch && (
				<EmptyState message="No games match your current filters. Try adjusting them or hit Surprise Me." />
			)}
		</div>
	);
};

export default SuggestTab;
