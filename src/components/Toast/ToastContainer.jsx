import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle } from "lucide-react";

const TOAST_VARIANTS = {
	success: {
		container:
			"bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100",
		icon: <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />,
	},
	error: {
		container:
			"bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
		icon: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
	},
};

const Toast = ({ toast, onRemove }) => {
	const variant = TOAST_VARIANTS[toast.type] ?? TOAST_VARIANTS.success;

	const handleRemove = useCallback(
		() => onRemove(toast.id),
		[onRemove, toast.id],
	);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 16, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 16, scale: 0.95 }}
			transition={{ duration: 0.2, ease: "easeOut" }}
			className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-sm ${variant.container}`}
			role="alert"
			aria-live="polite"
		>
			{variant.icon}
			<span className="flex-1 leading-snug">{toast.message}</span>
			<button
				onClick={handleRemove}
				className="ml-1 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-150 focus:outline-none shrink-0"
				aria-label="Dismiss notification"
			>
				<X className="w-3.5 h-3.5" />
			</button>
		</motion.div>
	);
};

const ToastContainer = ({ toasts, onRemove }) => (
	<div
		className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
		aria-label="Notifications"
	>
		<AnimatePresence mode="popLayout">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className="pointer-events-auto"
				>
					<Toast
						toast={toast}
						onRemove={onRemove}
					/>
				</div>
			))}
		</AnimatePresence>
	</div>
);

export default ToastContainer;
