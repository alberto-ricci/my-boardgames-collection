import React, { useState, useCallback, useRef, useEffect } from "react";
import { Share2, Check } from "lucide-react";
import { useLanguage } from "../../i18n";

const COPIED_DURATION = 2000;

const ShareButton = ({ userId, type = "collection" }) => {
	const { t } = useLanguage();
	const [copied, setCopied] = useState(false);
	const timerRef = useRef(null);

	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	const handleShare = useCallback(async () => {
		if (!userId) return;

		const url = `${window.location.origin}/share/${userId}?type=${type}`;

		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			clearTimeout(timerRef.current);
			timerRef.current = setTimeout(
				() => setCopied(false),
				COPIED_DURATION,
			);
		} catch {
			console.warn("Clipboard write failed.");
		}
	}, [userId, type]);

	return (
		<button
			onClick={handleShare}
			disabled={!userId}
			className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none"
			aria-label={`${t("header.share")} ${type}`}
		>
			{copied ? (
				<>
					<Check className="w-4 h-4 text-green-500 shrink-0" />
					<span className="text-green-500 hidden sm:inline text-sm font-medium">
						Copied!
					</span>
				</>
			) : (
				<>
					<Share2 className="w-4 h-4 shrink-0" />
					<span className="hidden sm:inline">
						{t("header.share")}
					</span>
				</>
			)}
		</button>
	);
};

export default ShareButton;
