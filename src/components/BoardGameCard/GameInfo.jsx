import React, { useMemo } from "react";
import { Users, Clock, Calendar } from "lucide-react";
import { useLanguage } from "../../i18n";

const InfoRow = ({ icon: Icon, iconClass, children }) => (
	<div className="flex items-center gap-2">
		<Icon className={`w-4 h-4 shrink-0 ${iconClass}`} />
		<span>{children}</span>
	</div>
);

const GameInfo = ({
	min_players,
	max_players,
	min_playtime,
	max_playtime,
	year_published,
}) => {
	const { t } = useLanguage();

	const playerCount = useMemo(() => {
		if (min_players == null && max_players == null) return "—";
		const label =
			min_players === 1 && max_players === 1
				? t("game.player")
				: t("game.players");
		if (min_players === max_players) return `${min_players} ${label}`;
		return `${min_players}–${max_players} ${label}`;
	}, [min_players, max_players, t]);

	const playtime = useMemo(() => {
		if (min_playtime == null && max_playtime == null) return "—";
		if (min_playtime === max_playtime)
			return `${min_playtime} ${t("game.min")}`;
		return `${min_playtime}–${max_playtime} ${t("game.min")}`;
	}, [min_playtime, max_playtime, t]);

	return (
		<div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
			<InfoRow
				icon={Users}
				iconClass="text-blue-500 dark:text-blue-400"
			>
				{playerCount}
			</InfoRow>
			<InfoRow
				icon={Clock}
				iconClass="text-emerald-500 dark:text-emerald-400"
			>
				{playtime}
			</InfoRow>
			{year_published && (
				<InfoRow
					icon={Calendar}
					iconClass="text-gray-400 dark:text-gray-500"
				>
					{year_published}
				</InfoRow>
			)}
		</div>
	);
};

export default GameInfo;
