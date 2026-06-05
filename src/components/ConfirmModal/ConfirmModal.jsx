import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useLanguage } from "../../i18n";

const ConfirmModal = ({ game, onConfirm, onCancel }) => {
	const { t } = useLanguage();

	useEffect(() => {
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
						initial={{ opacity: 0, scale: 0.97, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.97, y: 8 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
					>
						<div
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-sm p-6 shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2 shrink-0">
										<Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
									</div>
									<h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
										Remove game
									</h2>
								</div>
								<button
									onClick={onCancel}
									className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
									aria-label={t("modal.close")}
								>
									<X className="w-4 h-4" />
								</button>
							</div>

							{/* Body */}
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
								Are you sure you want to remove{" "}
								<span className="font-semibold text-gray-900 dark:text-gray-100">
									{game.name}
								</span>
								? This can't be undone.
							</p>

							{/* Actions */}
							<div className="flex gap-3">
								<button
									onClick={onCancel}
									className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
								>
									{t("expansions.cancel")}
								</button>
								<button
									onClick={onConfirm}
									className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
								>
									{t("expansions.remove")}
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
