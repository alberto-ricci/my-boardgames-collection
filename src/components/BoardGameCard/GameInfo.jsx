import React from "react";
import { Users, Clock, Calendar } from "lucide-react";
import { useLanguage } from "../../i18n";

const GameInfo = ({
	min_players,
	max_players,
	min_playtime,
	max_playtime,
	year_published,
}) => {
	const { t } = useLanguage();

	const formatPlayerCount = (min, max) => {
		if (min == null && max == null) return "—";
		const label =
			min === 1 && max === 1 ? t("game.player") : t("game.players");
		if (min === max) return `${min} ${label}`;
		return `${min}–${max} ${label}`;
	};

	const formatPlaytime = (min, max) => {
		if (min == null && max == null) return "—";
		if (min === max) return `${min} ${t("game.min")}`;
		return `${min}–${max} ${t("game.min")}`;
	};

	return (
		<div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
			<div className="flex items-center gap-2">
				<Users className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
				<span>{formatPlayerCount(min_players, max_players)}</span>
			</div>
			<div className="flex items-center gap-2">
				<Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
				<span>{formatPlaytime(min_playtime, max_playtime)}</span>
			</div>
			{year_published && (
				<div className="flex items-center gap-2">
					<Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
					<span>{year_published}</span>
				</div>
			)}
		</div>
	);
};

export default GameInfo;
