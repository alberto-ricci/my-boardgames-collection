// Add to imports
import { Pencil } from "lucide-react";

// Add onEdit prop
const GameModal = ({ game, onClose, onEdit }) => {
	// ... existing code ...

	// In the header section, add edit button next to close:
	<div className="relative">
		<GameImage name={game.name} id={game.id} />
		<div className="absolute top-2 right-2 flex gap-1">
			{onEdit && (
				<button
					onClick={() => { onClose(); onEdit(game); }}
					className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-md p-1.5 transition-colors duration-150 hover:bg-white dark:hover:bg-gray-700"
					aria-label={t("edit.title")}
				>
					<Pencil className="w-4 h-4" />
				</button>
			)}
			<button
				onClick={onClose}
				className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-md p-1.5 transition-colors duration-150 hover:bg-white dark:hover:bg-gray-700"
				aria-label={t("modal.close")}
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	</div>