const NavTabs = ({ activeTab, setActiveTab }) => {
	const tabs = [
		{ id: "collection", label: "My Collection" },
		{ id: "wishlist", label: "Wishlist (coming soon)" },
	];

	return (
		<nav className="bg-white border-b">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex space-x-8">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`py-4 px-2 border-b-2 font-medium text-sm ${
								activeTab === tab.id
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>
		</nav>
	);
};

export default NavTabs;
