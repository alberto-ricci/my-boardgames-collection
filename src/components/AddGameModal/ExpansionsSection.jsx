import React, { useCallback, useMemo } from "react";
import { Plus, Trash2, X, Check, Loader2 } from "lucide-react";
import { useLanguage } from "../../i18n";
import ExpansionSearch from "./ExpansionSearch";

const EMPTY_FORM = { name: "", year_published: "", notes: "", status: "owned" };

const INPUT_CLASS =
	"w-full px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-colors duration-150";

const ExpansionItem = ({ exp, onRemove }) => {
	const [pendingRemove, setPendingRemove] = React.useState(false);

	return (
		<div className="flex items-start justify-between gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
			<div className="min-w-0">
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
						{exp.name}
					</p>
					{exp.year_published && (
						<span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
							{exp.year_published}
						</span>
					)}
				</div>
				{exp.notes && (
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
						{exp.notes}
					</p>
				)}
			</div>

			{pendingRemove ? (
				<div className="flex items-center gap-2 shrink-0">
					<button
						onClick={() => onRemove(exp.id)}
						className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors duration-150"
					>
						Remove
					</button>
					<button
						onClick={() => setPendingRemove(false)}
						className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-150"
					>
						Cancel
					</button>
				</div>
			) : (
				<button
					onClick={() => setPendingRemove(true)}
					className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-150 shrink-0"
					aria-label={`Remove ${exp.name}`}
				>
					<Trash2 className="w-3.5 h-3.5" />
				</button>
			)}
		</div>
	);
};

const ExpansionsSection = ({ expansions, loading, onAdd, onRemove }) => {
	const { t } = useLanguage();
	const [showForm, setShowForm] = React.useState(false);
	const [form, setForm] = React.useState(EMPTY_FORM);
	const [saving, setSaving] = React.useState(false);

	const updateField = useCallback((field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSelect = useCallback((game) => {
		setForm((prev) => ({
			...prev,
			name: game.name ?? "",
			year_published: game.year_published?.toString() ?? "",
		}));
	}, []);

	const handleCancel = useCallback(() => {
		setShowForm(false);
		setForm(EMPTY_FORM);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name.trim()) return;
		setSaving(true);
		await onAdd({
			name: form.name.trim(),
			year_published: form.year_published
				? parseInt(form.year_published, 10)
				: null,
			notes: form.notes.trim() || null,
			status: form.status,
		});
		setForm(EMPTY_FORM);
		setShowForm(false);
		setSaving(false);
	};

	const owned = useMemo(
		() => expansions.filter((e) => e.status === "owned"),
		[expansions],
	);
	const wishlist = useMemo(
		() => expansions.filter((e) => e.status === "wishlist"),
		[expansions],
	);

	const groups = useMemo(
		() => [
			{ label: t("expansions.owned"), items: owned },
			{ label: t("expansions.wishlist"), items: wishlist },
		],
		[owned, wishlist, t],
	);

	return (
		<div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
					{t("expansions.title")}
					{expansions.length > 0 && (
						<span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md font-normal">
							{expansions.length}
						</span>
					)}
				</h3>
				{!showForm && (
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-150 focus:outline-none"
					>
						<Plus className="w-3.5 h-3.5" />
						{t("expansions.add")}
					</button>
				)}
			</div>

			{/* Add form */}
			{showForm && (
				<form
					onSubmit={handleSubmit}
					className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2"
				>
					<ExpansionSearch
						onSelect={handleSelect}
						inputClass={INPUT_CLASS}
					/>

					<input
						type="text"
						value={form.name}
						onChange={(e) => updateField("name", e.target.value)}
						placeholder={t("expansions.name_placeholder")}
						required
						autoFocus
						className={INPUT_CLASS}
					/>

					<div className="grid grid-cols-2 gap-2">
						<input
							type="number"
							value={form.year_published}
							onChange={(e) =>
								updateField("year_published", e.target.value)
							}
							placeholder={t("expansions.year_placeholder")}
							className={INPUT_CLASS}
						/>
						<select
							value={form.status}
							onChange={(e) =>
								updateField("status", e.target.value)
							}
							className={INPUT_CLASS}
						>
							<option value="owned">
								{t("expansions.owned")}
							</option>
							<option value="wishlist">
								{t("expansions.wishlist")}
							</option>
						</select>
					</div>

					<input
						type="text"
						value={form.notes}
						onChange={(e) => updateField("notes", e.target.value)}
						placeholder={t("expansions.notes_placeholder")}
						className={INPUT_CLASS}
					/>

					<div className="flex gap-2 pt-1">
						<button
							type="submit"
							disabled={saving}
							className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors duration-150 focus:outline-none"
						>
							{saving ? (
								<>
									<Loader2 className="w-3.5 h-3.5 animate-spin" />
									{t("expansions.saving")}
								</>
							) : (
								<>
									<Check className="w-3.5 h-3.5" />
									{t("expansions.save")}
								</>
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors duration-150 focus:outline-none"
						>
							<X className="w-3.5 h-3.5" />
							{t("expansions.cancel")}
						</button>
					</div>
				</form>
			)}

			{/* Lists */}
			{loading ? (
				<div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 py-1">
					<Loader2 className="w-3.5 h-3.5 animate-spin" />
					{t("expansions.loading")}
				</div>
			) : expansions.length === 0 ? (
				<p className="text-xs text-gray-400 dark:text-gray-500 py-1">
					{t("expansions.empty")}
				</p>
			) : (
				<div className="space-y-3">
					{groups.map(({ label, items }) =>
						items.length === 0 ? null : (
							<div key={label}>
								<p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
									{label}
								</p>
								<div className="space-y-1.5">
									{items.map((exp) => (
										<ExpansionItem
											key={exp.id}
											exp={exp}
											onRemove={onRemove}
										/>
									))}
								</div>
							</div>
						),
					)}
				</div>
			)}
		</div>
	);
};

export default ExpansionsSection;
