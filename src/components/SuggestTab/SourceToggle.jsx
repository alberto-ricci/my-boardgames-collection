import React from "react";
import { Library, BookmarkCheck, Shuffle } from "lucide-react";

const SOURCE_OPTIONS = [
	{ value: "collection", label: "Collection", icon: Library },
	{ value: "wishlist", label: "Wishlist", icon: BookmarkCheck },
	{ value: "both", label: "Both", icon: Shuffle },
];

const SourceToggle = ({ source, onChange, collectionCount, wishlistCount }) => {
	const countFor = (value) => {
		if (value === "collection") return collectionCount;
		if (value === "wishlist") return wishlistCount;
		return collectionCount + wishlistCount;
	};

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
			<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
				Pick from
			</p>
			<div className="flex gap-2 flex-wrap">
				{SOURCE_OPTIONS.map(({ value, label, icon: Icon }) => (
					<button
						key={value}
						onClick={() => onChange(value)}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
							source === value
								? "bg-blue-500 border-blue-500 text-white shadow-sm"
								: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600"
						}`}
					>
						<Icon className="w-4 h-4" />
						{label}
						<span
							className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
								source === value
									? "bg-blue-400 text-white"
									: "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300"
							}`}
						>
							{countFor(value)}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default SourceToggle;
