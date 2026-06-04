import React from "react";

const CategoryTags = ({ categories = [] }) => {
	const visible = categories.slice(0, 3);
	const remaining = categories.length - visible.length;

	return (
		<div className="flex flex-wrap gap-1 mt-3">
			{visible.map((cat) => (
				<span
					key={cat}
					className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
				>
					{cat}
				</span>
			))}
			{remaining > 0 && (
				<span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
					+{remaining}
				</span>
			)}
		</div>
	);
};

export default CategoryTags;
