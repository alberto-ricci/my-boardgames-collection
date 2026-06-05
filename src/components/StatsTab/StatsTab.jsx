import React, { useMemo } from "react";
import { useLanguage } from "../../i18n";
import {
	Gamepad2,
	Clock,
	User,
	Calendar,
	Tag,
	Users,
	Timer,
	Star,
} from "lucide-react";

/* ─── Stat Card ─────────────────────────────────────────────────── */
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

/* ─── Section Card ───────────────────────────────────────────────── */
const SectionCard = ({ icon: Icon, title, children }) => (
	<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
		<div className="flex items-center gap-2 mb-4">
			<Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
			<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
				{title}
			</h3>
		</div>
		{children}
	</div>
);

/* ─── Horizontal Bar Row ─────────────────────────────────────────── */
const BarRow = ({
	label,
	count,
	max,
	color = "bg-blue-500 dark:bg-blue-400",
}) => (
	<div className="flex items-center gap-3">
		<span className="text-sm text-gray-600 dark:text-gray-300 w-36 shrink-0 truncate">
			{label}
		</span>
		<div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
			<div
				className={`${color} h-2 rounded-full transition-all duration-500 ease-out`}
				style={{ width: `${(count / max) * 100}%` }}
			/>
		</div>
		<span className="text-xs tabular-nums text-gray-400 dark:text-gray-500 w-6 text-right shrink-0">
			{count}
		</span>
	</div>
);

/* ─── Donut Chart (SVG) ──────────────────────────────────────────── */
const DonutChart = ({ segments }) => {
	const size = 140;
	const r = 50;
	const cx = size / 2;
	const cy = size / 2;
	const circumference = 2 * Math.PI * r;
	const total = segments.reduce((s, seg) => s + seg.value, 0);

	let offset = 0;
	const slices = segments.map((seg) => {
		const dash = total === 0 ? 0 : (seg.value / total) * circumference;
		const gap = circumference - dash;
		const slice = { ...seg, dash, gap, offset };
		offset += dash;
		return slice;
	});

	return (
		<div className="flex items-center gap-6">
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="shrink-0 -rotate-90"
			>
				{/* Track */}
				<circle
					cx={cx}
					cy={cy}
					r={r}
					fill="none"
					stroke="currentColor"
					className="text-gray-100 dark:text-gray-700"
					strokeWidth={18}
				/>
				{slices.map((s, i) =>
					s.value > 0 ? (
						<circle
							key={i}
							cx={cx}
							cy={cy}
							r={r}
							fill="none"
							stroke={s.stroke}
							strokeWidth={18}
							strokeDasharray={`${s.dash} ${s.gap}`}
							strokeDashoffset={-s.offset}
							strokeLinecap="round"
						/>
					) : null,
				)}
				{/* Center label */}
				<text
					x={cx}
					y={cy}
					textAnchor="middle"
					dominantBaseline="central"
					className="fill-gray-700 dark:fill-gray-200"
					style={{ fontSize: 22, fontWeight: 700, rotate: "90deg" }}
					transform={`rotate(90, ${cx}, ${cy})`}
				>
					{total}
				</text>
				<text
					x={cx}
					y={cy + 14}
					textAnchor="middle"
					className="fill-gray-400 dark:fill-gray-500"
					style={{ fontSize: 9 }}
					transform={`rotate(90, ${cx}, ${cy})`}
				>
					games
				</text>
			</svg>
			<div className="space-y-2">
				{segments.map((s, i) => (
					<div
						key={i}
						className="flex items-center gap-2"
					>
						<span
							className="w-2.5 h-2.5 rounded-full shrink-0"
							style={{ background: s.stroke }}
						/>
						<span className="text-sm text-gray-600 dark:text-gray-300">
							{s.label}
						</span>
						<span className="text-sm font-semibold text-gray-800 dark:text-gray-100 ml-auto pl-4 tabular-nums">
							{s.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

/* ─── Bubble Grid (player sweet spot) ───────────────────────────── */
const BubbleGrid = ({ data, sweetSpot }) => {
	const max = Math.max(...data.map((d) => d.count), 1);
	return (
		<div className="flex flex-wrap gap-3">
			{data.map(({ players, count }) => {
				const ratio = count / max;
				const size = 32 + ratio * 36; // 32–68px
				const isSweet = players === sweetSpot;
				return (
					<div
						key={players}
						className="flex flex-col items-center gap-1"
					>
						<div
							className={`rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
								isSweet
									? "bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-600 shadow-lg"
									: "bg-blue-400 dark:bg-blue-600"
							}`}
							style={{
								width: size,
								height: size,
								fontSize: size * 0.28,
							}}
						>
							{count}
						</div>
						<span
							className={`text-xs font-medium ${isSweet ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}
						>
							{players}p
						</span>
					</div>
				);
			})}
		</div>
	);
};

/* ─── Decade Timeline ────────────────────────────────────────────── */
const DecadeTimeline = ({ data }) => {
	const max = Math.max(...data.map((d) => d.count), 1);
	const barColors = [
		"bg-amber-300 dark:bg-amber-500",
		"bg-orange-400 dark:bg-orange-500",
		"bg-rose-400 dark:bg-rose-500",
		"bg-pink-400 dark:bg-pink-500",
		"bg-violet-400 dark:bg-violet-500",
		"bg-blue-400 dark:bg-blue-500",
		"bg-teal-400 dark:bg-teal-500",
	];
	return (
		<div className="flex items-end gap-2 h-28">
			{data.map(({ decade, count }, i) => {
				const heightPct = (count / max) * 100;
				return (
					<div
						key={decade}
						className="flex flex-col items-center gap-1 flex-1 min-w-0"
					>
						<span className="text-xs tabular-nums font-semibold text-gray-500 dark:text-gray-400">
							{count}
						</span>
						<div
							className="w-full rounded-t-md transition-all duration-500 ease-out"
							style={{ height: `${Math.max(heightPct, 8)}%` }}
							className={`w-full rounded-t-md transition-all duration-500 ${barColors[i % barColors.length]}`}
						/>
						<span className="text-xs text-gray-400 dark:text-gray-500 truncate w-full text-center">
							{decade}s
						</span>
					</div>
				);
			})}
		</div>
	);
};

/* ─── Main Component ─────────────────────────────────────────────── */
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

		// Categories
		const categoryCounts = {};
		collection.forEach((g) => {
			g.categories?.forEach((cat) => {
				categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
			});
		});
		const topCategories = Object.entries(categoryCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8);

		// Player sweet spot
		const playerCountFreq = {};
		collection.forEach((g) => {
			if (g.min_players && g.max_players) {
				for (
					let p = g.min_players;
					p <= Math.min(g.max_players, 10);
					p++
				) {
					playerCountFreq[p] = (playerCountFreq[p] || 0) + 1;
				}
			}
		});
		const playerRangeCounts = Object.entries(playerCountFreq)
			.map(([p, count]) => ({ players: Number(p), count }))
			.sort((a, b) => a.players - b.players);
		const sweetSpot = playerRangeCounts.reduce(
			(best, cur) => (cur.count > best.count ? cur : best),
			{ players: 0, count: 0 },
		).players;

		// Decade breakdown
		const decadeCounts = {};
		withYear.forEach((g) => {
			const decade = Math.floor(g.year_published / 10) * 10;
			decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
		});
		const decadeBreakdown = Object.entries(decadeCounts)
			.map(([decade, count]) => ({ decade: Number(decade), count }))
			.sort((a, b) => a.decade - b.decade);

		// Playtime distribution (donut)
		const playtimeBuckets = { quick: 0, medium: 0, long: 0 };
		withPlaytime.forEach((g) => {
			if (g.max_playtime < 30) playtimeBuckets.quick++;
			else if (g.max_playtime <= 90) playtimeBuckets.medium++;
			else playtimeBuckets.long++;
		});

		// Best year
		const yearCounts = {};
		withYear.forEach((g) => {
			yearCounts[g.year_published] =
				(yearCounts[g.year_published] || 0) + 1;
		});
		const topYear =
			Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0] ?? null;

		return {
			total,
			soloCount,
			avgPlaytime,
			oldest,
			newest,
			topCategories,
			playerRangeCounts,
			sweetSpot,
			decadeBreakdown,
			playtimeBuckets,
			topYear,
		};
	}, [collection]);

	if (!stats) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
				<div className="text-6xl mb-4">📊</div>
				<p className="text-sm">Add some games to see your stats.</p>
			</div>
		);
	}

	const {
		total,
		soloCount,
		avgPlaytime,
		oldest,
		newest,
		topCategories,
		playerRangeCounts,
		sweetSpot,
		decadeBreakdown,
		playtimeBuckets,
		topYear,
	} = stats;

	const maxCategoryCount = topCategories[0]?.[1] ?? 1;
	const donutSegments = [
		{
			label: "Quick (< 30 min)",
			value: playtimeBuckets.quick,
			stroke: "#14b8a6",
		},
		{
			label: "Medium (30–90 min)",
			value: playtimeBuckets.medium,
			stroke: "#8b5cf6",
		},
		{
			label: "Long (90+ min)",
			value: playtimeBuckets.long,
			stroke: "#f43f5e",
		},
	];

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
				{topYear && (
					<StatCard
						icon={Star}
						label="Best year"
						value={topYear[0]}
						sub={`${topYear[1]} game${topYear[1] > 1 ? "s" : ""}`}
						color="bg-orange-500"
					/>
				)}
			</div>

			{/* Playtime donut */}
			{donutSegments.some((s) => s.value > 0) && (
				<SectionCard
					icon={Timer}
					title="Playtime distribution"
				>
					<DonutChart segments={donutSegments} />
				</SectionCard>
			)}

			{/* Player sweet spot bubbles */}
			{playerRangeCounts.length > 0 && (
				<SectionCard
					icon={Users}
					title={`Player count coverage · sweet spot: ${sweetSpot}p`}
				>
					<BubbleGrid
						data={playerRangeCounts}
						sweetSpot={sweetSpot}
					/>
				</SectionCard>
			)}

			{/* Decade column chart */}
			{decadeBreakdown.length > 0 && (
				<SectionCard
					icon={Calendar}
					title="Games by decade"
				>
					<DecadeTimeline data={decadeBreakdown} />
				</SectionCard>
			)}

			{/* Top categories bar chart */}
			{topCategories.length > 0 && (
				<SectionCard
					icon={Tag}
					title={t("stats.top_categories")}
				>
					<div className="space-y-2.5">
						{topCategories.map(([cat, count]) => (
							<BarRow
								key={cat}
								label={cat}
								count={count}
								max={maxCategoryCount}
							/>
						))}
					</div>
				</SectionCard>
			)}
		</div>
	);
};

export default StatsTab;
