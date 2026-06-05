import React, { useMemo } from "react";
import { useLanguage } from "../../i18n";
import { Gamepad2, Clock, User, Calendar, Tag } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
	<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center gap-4">
		<div className={`rounded-xl p-3 shrink-0 ${color}`}>
			<Icon className="w-5 h-5 text-white" />
		</div>
		<div className="min-w-0">
			<p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
			<p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
				{value}
			</p>
			{sub && (
				<p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
					{sub}
				</p>
			)}
		</div>
	</div>
);

const StatsTab = ({ collection }) => {
	const { t } = useLanguage();

	const stats = useMemo(() => {
		const total = collection.length;
		if (total === 0) return null;

		const soloCount = collection.filter((g) => g.min_players === 1).length;

		const withPlaytime = collection.filter((g) => g.max_playtime);
		const avgPlaytime =
			withPlaytime.length === 0
				? 0
				: Math.round(
						withPlaytime.reduce(
							(sum, g) => sum + g.max_playtime,
							0,
						) / withPlaytime.length,
					);

		const withYear = collection.filter((g) => g.year_published);
		const sorted = [...withYear].sort(
			(a, b) => a.year_published - b.year_published,
		);
		const oldest = sorted[0] ?? null;
		const newest = sorted[sorted.length - 1] ?? null;

		const categoryCounts = {};
		collection.forEach((g) => {
			g.categories?.forEach((cat) => {
				categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
			});
		});
		const topCategories = Object.entries(categoryCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8);

		return { total, soloCount, avgPlaytime, oldest, newest, topCategories };
	}, [collection]);

	if (!stats) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
				<div className="text-6xl mb-4">📊</div>
				<p className="text-sm">Add some games to see your stats.</p>
			</div>
		);
	}

	const { total, soloCount, avgPlaytime, oldest, newest, topCategories } =
		stats;
	const maxCategoryCount = topCategories[0]?.[1] ?? 1;

	return (
		<div className="space-y-6">
			{/* Stat cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<StatCard
					icon={Gamepad2}
					label={t("stats.total")}
					value={total}
					color="bg-blue-500"
				/>
				<StatCard
					icon={User}
					label={t("stats.solo")}
					value={soloCount}
					sub={`${Math.round((soloCount / total) * 100)}% of collection`}
					color="bg-emerald-500"
				/>
				<StatCard
					icon={Clock}
					label={t("stats.avg_playtime")}
					value={`${avgPlaytime} ${t("stats.avg_playtime_unit")}`}
					color="bg-violet-500"
				/>
				{oldest && (
					<StatCard
						icon={Calendar}
						label={t("stats.oldest")}
						value={oldest.name}
						sub={oldest.year_published}
						color="bg-amber-500"
					/>
				)}
				{newest && newest.name !== oldest?.name && (
					<StatCard
						icon={Calendar}
						label={t("stats.newest")}
						value={newest.name}
						sub={newest.year_published}
						color="bg-pink-500"
					/>
				)}
			</div>

			{/* Top categories */}
			{topCategories.length > 0 && (
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
					<div className="flex items-center gap-2 mb-4">
						<Tag className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
						<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							{t("stats.top_categories")}
						</h3>
					</div>
					<div className="space-y-2.5">
						{topCategories.map(([cat, count]) => (
							<div
								key={cat}
								className="flex items-center gap-3"
							>
								<span className="text-sm text-gray-600 dark:text-gray-300 w-36 shrink-0 truncate">
									{cat}
								</span>
								<div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
									<div
										className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
										style={{
											width: `${(count / maxCategoryCount) * 100}%`,
										}}
									/>
								</div>
								<span className="text-xs tabular-nums text-gray-400 dark:text-gray-500 w-6 text-right shrink-0">
									{count}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default StatsTab;
