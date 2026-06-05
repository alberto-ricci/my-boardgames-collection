import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
	const [visible, setVisible] = React.useState(false);

	React.useEffect(() => {
		const handleScroll = () => setVisible(window.scrollY > 300);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

	return (
		<AnimatePresence>
			{visible && (
				<motion.button
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.15 }}
					onClick={scrollToTop}
					className="fixed bottom-20 right-6 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg p-2.5 shadow-md transition-colors duration-200"
					aria-label="Scroll to top"
				>
					<ArrowUp className="w-4 h-4" />
				</motion.button>
			)}
		</AnimatePresence>
	);
};

export default ScrollToTop;
