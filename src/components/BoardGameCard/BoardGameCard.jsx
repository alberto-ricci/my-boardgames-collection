import React from "react";
import GameImage from "./GameImage";
import GameInfo from "./GameInfo";
import CategoryTags from "./CategoryTags";

/**
 * BoardGameCard - displays a single board game card with image, details and categories.
 */
const BoardGameCard = ({ game }) => {
	if (!game) return null;

	return (
		<article
			className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
			aria-label={game.name}
		>
			<GameImage
				name={game.name}
				id={game.id}
				image_url={game.image_url}
			/>

			<div className="p-4 flex flex-col flex-grow justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
						{game.name}
					</h3>

					<GameInfo
						min_players={game.min_players}
						max_players={game.max_players}
						min_playtime={game.min_playtime}
						max_playtime={game.max_playtime}
						year_published={game.year_published}
					/>
				</div>

				{game.categories?.length > 0 && (
					<CategoryTags categories={game.categories} />
				)}
			</div>
		</article>
	);
};

export default BoardGameCard;
