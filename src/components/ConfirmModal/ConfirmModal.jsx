import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

const ConfirmModal = ({ game, onConfirm, onCancel }) => {
	React.useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onCancel();
			if (e.key === "Enter") onConfirm();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onConfirm, onCancel]);

	return (
		<AnimatePresence>
			{game && (
				<>
					<motion.div
						className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onCancel}
					/>
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
						initial={{ opacity: 0, scale: 0.97 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.97 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
					>
						<div
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-sm p-6"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
										<Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
									</div>
									<h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
										Remove game
									</h2>
								</div>
								<button
									onClick={onCancel}
									className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-150"
								>
									<X className="w-4 h-4" />
								</button>
							</div>

							<p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
								Are you sure you want to remove{" "}
								<span className="font-medium text-gray-900 dark:text-gray-100">
									{game.name}
								</span>{" "}
								from your collection? This can't be undone.
							</p>

							<div className="flex gap-3">
								<button
									onClick={onCancel}
									className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-150"
								>
									Cancel
								</button>
								<button
									onClick={onConfirm}
									className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-150"
								>
									Remove
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ConfirmModal;
