import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle, Sun, Moon } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n";
import ShareButton from "./SharedView/ShareButton";

const LANGUAGES = [
	{ code: "en", flag: "🇬🇧", label: "EN" },
	{ code: "it", flag: "🇮🇹", label: "IT" },
	{ code: "ro", flag: "🇷🇴", label: "RO" },
];

const Divider = () => (
	<div className="w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0" />
);

const Header = ({ userId, activeTab, profile, isDark, onToggleDark }) => {
	const navigate = useNavigate();
	const { t, language, setLang } = useLanguage();
	const [langOpen, setLangOpen] = useState(false);
	const langRef = useRef(null);
	const current = LANGUAGES.find((l) => l.code === language);

	// Close language dropdown when clicking outside
	useEffect(() => {
		if (!langOpen) return;
		const handleClickOutside = (e) => {
			if (langRef.current && !langRef.current.contains(e.target)) {
				setLangOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [langOpen]);

	const handleLogout = useCallback(async () => {
		await supabase.auth.signOut();
	}, []);

	const handleNavigateProfile = useCallback(() => {
		navigate("/profile");
	}, [navigate]);

	const handleSelectLang = useCallback(
		(code) => {
			setLang(code);
			setLangOpen(false);
		},
		[setLang],
	);

	const toggleLang = useCallback(() => setLangOpen((prev) => !prev), []);

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

					<Divider />

					{/* Language selector */}
					<div
						className="relative"
						ref={langRef}
					>
						<button
							onClick={toggleLang}
							className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150 focus:outline-none"
							aria-label="Select language"
							aria-expanded={langOpen}
							aria-haspopup="listbox"
						>
							<span>{current?.flag}</span>
							<span className="hidden sm:inline font-medium">
								{current?.label}
							</span>
						</button>

						{langOpen && (
							<div
								className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
								role="listbox"
								aria-label="Language options"
							>
								{LANGUAGES.map((lang) => {
									const isSelected = language === lang.code;
									return (
										<button
											key={lang.code}
											onClick={() =>
												handleSelectLang(lang.code)
											}
											role="option"
											aria-selected={isSelected}
											className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 focus:outline-none ${
												isSelected
													? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
													: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
											}`}
										>
											<span>{lang.flag}</span>
											<span>{lang.label}</span>
										</button>
									);
								})}
							</div>
						)}
					</div>

					{/* Dark mode toggle */}
					<button
						onClick={onToggleDark}
						className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
						aria-label={
							isDark
								? "Switch to light mode"
								: "Switch to dark mode"
						}
					>
						{isDark ? (
							<Sun className="w-4 h-4" />
						) : (
							<Moon className="w-4 h-4" />
						)}
					</button>

					<Divider />

					{/* Profile */}
					<button
						onClick={handleNavigateProfile}
						className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 focus:outline-none"
						aria-label={t("header.profile")}
					>
						{profile?.avatar_url ? (
							<img
								src={profile.avatar_url}
								alt="avatar"
								className="w-8 h-8 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-gray-700 shrink-0"
							/>
						) : (
							<UserCircle className="w-8 h-8 text-gray-400 shrink-0" />
						)}
						<span className="font-medium hidden sm:inline">
							{profile?.username || t("header.profile")}
						</span>
					</button>

					<Divider />

					{/* Sign out */}
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none"
						aria-label={t("header.signout")}
					>
						<LogOut className="w-4 h-4 shrink-0" />
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
