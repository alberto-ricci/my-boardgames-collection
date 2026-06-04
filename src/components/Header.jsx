import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LogOut, UserCircle, Sun, Moon, Globe } from "lucide-react";
import ShareButton from "./SharedView/ShareButton";
import { useLanguage } from "../i18n/index.jsx";

const LANGUAGES = [
	{ code: "en", flag: "🇬🇧", label: "EN" },
	{ code: "it", flag: "🇮🇹", label: "IT" },
];

const Header = ({ userId, activeTab, profile, isDark, onToggleDark }) => {
	const navigate = useNavigate();
	const { t, language, setLang } = useLanguage();
	const [langOpen, setLangOpen] = React.useState(false);
	const current = LANGUAGES.find((l) => l.code === language);

	const handleLogout = async () => {
		await supabase.auth.signOut();
	};

	return (
		<header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
				{/* Title */}
				<div className="min-w-0">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
						{t("header.title")}
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
						{t("header.subtitle")}
					</p>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 shrink-0">
					<ShareButton
						userId={userId}
						type={activeTab}
					/>

					<div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

					{/* Language selector */}
					<div className="relative">
						<button
							onClick={() => setLangOpen((prev) => !prev)}
							className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
							aria-label="Select language"
						>
							<span>{current?.flag}</span>
							<span className="hidden sm:inline font-medium">
								{current?.label}
							</span>
						</button>

						{langOpen && (
							<div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
								{LANGUAGES.map((lang) => (
									<button
										key={lang.code}
										onClick={() => {
											setLang(lang.code);
											setLangOpen(false);
										}}
										className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 ${
											language === lang.code
												? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
												: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
										}`}
									>
										<span>{lang.flag}</span>
										<span>{lang.label}</span>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Dark mode toggle */}
					<button
						onClick={onToggleDark}
						className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
						aria-label="Toggle dark mode"
					>
						{isDark ? (
							<Sun className="w-4 h-4" />
						) : (
							<Moon className="w-4 h-4" />
						)}
					</button>

					<div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

					{/* Profile */}
					<button
						onClick={() => navigate("/profile")}
						className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
						aria-label={t("header.profile")}
					>
						{profile?.avatar_url ? (
							<img
								src={profile.avatar_url}
								alt="avatar"
								className="w-8 h-8 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-gray-700"
							/>
						) : (
							<UserCircle className="w-8 h-8 text-gray-400" />
						)}
						<span className="font-medium hidden sm:inline">
							{profile?.username || t("header.profile")}
						</span>
					</button>

					<div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

					{/* Sign out */}
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
						aria-label={t("header.signout")}
					>
						<LogOut className="w-4 h-4" />
						<span className="hidden sm:inline">
							{t("header.signout")}
						</span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
