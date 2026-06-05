import React from "react";

const EmptyState = ({ message }) => (
	<div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
		<div className="text-5xl mb-3">🎲</div>
		<p className="text-sm text-center max-w-xs">{message}</p>
	</div>
);

export default EmptyState;
