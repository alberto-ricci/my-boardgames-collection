import React from "react";
import GameImage from "./GameImage";
import GameInfo from "./GameInfo";
import CategoryTags from "./CategoryTags";

const BoardGameCard = ({ game, onClick }) => {
	if (!game) return null;

	return (
		<article
			onClick={onClick}
			className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200 flex flex-col h-full cursor-pointer"
			aria-label={`${game.name} board game card`}
		>
			<GameImage
				name={game.name}
				id={game.id}
			/>

			<div className="p-5 flex flex-col flex-grow justify-between gap-4">
				<div className="space-y-3">
					<h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
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
