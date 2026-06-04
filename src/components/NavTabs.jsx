import React from "react";

const TABS = [
	{ id: "collection", label: "My Collection" },
	{ id: "wishlist", label: "Wishlist", disabled: true },
];

const NavTabs = ({ activeTab, setActiveTab }) => (
	<nav className="bg-white border-b">
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
						disabled={tab.disabled}
						onClick={() => !tab.disabled && setActiveTab(tab.id)}
						className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
							activeTab === tab.id
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						} ${tab.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
					>
						{tab.label}
						{tab.disabled && (
							<span className="ml-2 text-xs text-gray-400">
								(coming soon)
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	</nav>
);

export default NavTabs;
