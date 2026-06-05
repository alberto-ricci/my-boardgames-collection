import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle } from "lucide-react";

const Toast = ({ toast, onRemove }) => {
	const isSuccess = toast.type === "success";

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 20, scale: 0.95 }}
			transition={{ duration: 0.2, ease: "easeOut" }}
			className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
				isSuccess
					? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
					: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
			}`}
		>
			{isSuccess ? (
				<CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
			) : (
				<AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
			)}
			<span>{toast.message}</span>
			<button
				onClick={() => onRemove(toast.id)}
				className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
			>
				<X className="w-3.5 h-3.5" />
			</button>
		</motion.div>
	);
};

const ToastContainer = ({ toasts, onRemove }) => (
	<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
		<AnimatePresence>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					toast={toast}
					onRemove={onRemove}
				/>
			))}
		</AnimatePresence>
	</div>
);

export default ToastContainer;
