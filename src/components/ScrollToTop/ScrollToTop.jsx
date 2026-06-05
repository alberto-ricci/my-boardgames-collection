import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const SCROLL_THRESHOLD = 300;

const ScrollToTop = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () =>
			setVisible(window.scrollY > SCROLL_THRESHOLD);

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<AnimatePresence>
			{visible && (
				<motion.button
					initial={{ opacity: 0, scale: 0.8, y: 8 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: 8 }}
					transition={{ duration: 0.15, ease: "easeOut" }}
					onClick={scrollToTop}
					className="fixed bottom-20 right-6 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg rounded-lg p-2.5 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
					aria-label="Scroll to top"
				>
					<ArrowUp className="w-4 h-4" />
				</motion.button>
			)}
		</AnimatePresence>
	);
};

export default ScrollToTop;
