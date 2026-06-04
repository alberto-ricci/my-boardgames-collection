import React from "react";
import { Plus } from "lucide-react";
import { useLanguage } from "../../i18n";

const AddGameButton = ({ onClick }) => {
	const { t } = useLanguage();

	return (
		<button
			onClick={onClick}
			className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-3 rounded-lg shadow-lg transition-colors duration-200"
			aria-label={t("add.button")}
		>
			<Plus className="w-5 h-5" />
			<span className="hidden sm:inline">{t("add.button")}</span>
		</button>
	);
};

export default AddGameButton;
