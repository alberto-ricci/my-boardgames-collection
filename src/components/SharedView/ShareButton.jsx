import React from "react";
import { Share2, Check } from "lucide-react";
import { useLanguage } from "../../i18n";

const ShareButton = ({ userId, type = "collection" }) => {
	const { t } = useLanguage();
	const [copied, setCopied] = React.useState(false);

	const handleShare = async () => {
		const url = `${window.location.origin}/share/${userId}?type=${type}`;
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			onClick={handleShare}
			className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
			aria-label={`${t("header.share")} ${type}`}
		>
			{copied ? (
				<>
					<Check className="w-4 h-4 text-green-500" />
					<span className="text-green-500 hidden sm:inline">
						Copied!
					</span>
				</>
			) : (
				<>
					<Share2 className="w-4 h-4" />
					<span className="hidden sm:inline">
						{t("header.share")}
					</span>
				</>
			)}
		</button>
	);
};

export default ShareButton;
