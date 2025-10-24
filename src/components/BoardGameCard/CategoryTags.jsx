import React from "react";

const CategoryTags = ({ categories = [] }) => (
	<div className="flex flex-wrap gap-1 mt-3">
		{categories.slice(0, 3).map((cat) => (
			<span
				key={cat}
				className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
			>
				{cat}
			</span>
		))}
	</div>
);

export default CategoryTags;
