import React from "react";
import { Users, Clock, Calendar } from "lucide-react";

const formatPlayerCount = (min, max) => {
	if (min == null && max == null) return "—";
	if (min === max) return `${min} ${min === 1 ? "player" : "players"}`;
	return `${min}-${max} players`;
};

const formatPlaytime = (min, max) => {
	if (min == null && max == null) return "—";
	if (min === max) return `${min} min`;
	return `${min}-${max} min`;
};

const GameInfo = ({
	min_players,
	max_players,
	min_playtime,
	max_playtime,
	year_published,
}) => (
	<div className="space-y-1 text-sm text-gray-600">
		<div className="flex items-center gap-2">
			<Users className="w-4 h-4 text-blue-500" />
			<span>{formatPlayerCount(min_players, max_players)}</span>
		</div>
		<div className="flex items-center gap-2">
			<Clock className="w-4 h-4 text-green-500" />
			<span>{formatPlaytime(min_playtime, max_playtime)}</span>
		</div>
		{year_published && (
			<div className="flex items-center gap-2">
				<Calendar className="w-4 h-4 text-gray-500" />
				<span>{year_published}</span>
			</div>
		)}
	</div>
);

export default GameInfo;
