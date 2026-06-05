import React from "react";
import { useLanguage } from "../i18n";

const TABS = [
	{ id: "collection", labelKey: "nav.collection" },
	{ id: "wishlist", labelKey: "nav.wishlist" },
	{ id: "stats", labelKey: "nav.stats" },
];

const NavTabs = ({ activeTab, setActiveTab }) => {
	const { t } = useLanguage();

	return (
		<nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-6xl mx-auto px-4">
				<div
					className="flex space-x-8"
					role="tablist"
				>
					{TABS.map((tab) => (
						<button
							key={tab.id}
							role="tab"
							aria-selected={activeTab === tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
								activeTab === tab.id
									? "border-blue-500 text-blue-600 dark:text-blue-400"
									: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
							}`}
						>
							{t(tab.labelKey)}
						</button>
					))}
				</div>
			</div>
		</nav>
	);
};

export default NavTabs;
