import React from "react";
import { X, Plus } from "lucide-react";
import { useLanguage } from "../../i18n";

const CategoryInput = ({
	categories,
	existingCategories,
	onChange,
	inputClass,
}) => {
	const { t } = useLanguage();
	const [catInput, setCatInput] = React.useState("");

	const addCategory = (cat) => {
		const trimmed = cat.trim();
		if (!trimmed || categories.includes(trimmed)) return;
		onChange([...categories, trimmed]);
		setCatInput("");
	};

	const removeCategory = (cat) => {
		onChange(categories.filter((c) => c !== cat));
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addCategory(catInput);
		}
	};

	const unused = existingCategories.filter((c) => !categories.includes(c));

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				{t("add.field.categories")}
			</label>

			{categories.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mb-2">
					{categories.map((cat) => (
						<span
							key={cat}
							className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded"
						>
							{cat}
							<button
								type="button"
								onClick={() => removeCategory(cat)}
								className="hover:text-blue-800 dark:hover:text-blue-200"
							>
								<X className="w-3 h-3" />
							</button>
						</span>
					))}
				</div>
			)}

			<div className="relative">
				<input
					type="text"
					value={catInput}
					onChange={(e) => setCatInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={t("add.field.categories.placeholder")}
					className={inputClass}
				/>
				{catInput && (
					<button
						type="button"
						onClick={() => addCategory(catInput)}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
					>
						<Plus className="w-4 h-4" />
					</button>
				)}
			</div>

			{unused.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mt-2">
					{unused.map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() => addCategory(cat)}
							className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
						>
							{cat}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default CategoryInput;
