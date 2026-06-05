import React from "react";
import { Sparkles, Shuffle } from "lucide-react";

const ActionButtons = ({ onSuggest, onSurprise, disabled }) => (
	<div className="grid grid-cols-2 gap-3">
		<button
			onClick={onSuggest}
			disabled={disabled}
			className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-150 shadow-sm"
		>
			<Sparkles className="w-4 h-4" />
			Suggest
		</button>
		<button
			onClick={onSurprise}
			className="flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors duration-150 shadow-sm"
		>
			<Shuffle className="w-4 h-4" />
			Surprise Me
		</button>
	</div>
);

export default ActionButtons;
