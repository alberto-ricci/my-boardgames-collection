import React from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import ExpansionSearch from "./ExpansionSearch";

const STATUS_COLORS = {
	owned: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
	wishlist: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
};

const EMPTY_FORM = { name: "", year_published: "", notes: "", status: "owned" };

const inputClass =
	"w-full px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600";

const ExpansionsSection = ({
	gameId,
	userId,
	expansions,
	loading,
	onAdd,
	onRemove,
}) => {
	const [showForm, setShowForm] = React.useState(false);
	const [form, setForm] = React.useState(EMPTY_FORM);
	const [saving, setSaving] = React.useState(false);
	const [pendingRemove, setPendingRemove] = React.useState(null);

	const updateField = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSelect = (game) => {
		setForm((prev) => ({
			...prev,
			name: game.name ?? "",
			year_published: game.year_published?.toString() ?? "",
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name.trim()) return;
		setSaving(true);
		await onAdd({
			name: form.name.trim(),
			year_published: form.year_published
				? parseInt(form.year_published)
				: null,
			notes: form.notes.trim() || null,
			status: form.status,
		});
		setForm(EMPTY_FORM);
		setShowForm(false);
		setSaving(false);
	};

	const owned = expansions.filter((e) => e.status === "owned");
	const wishlist = expansions.filter((e) => e.status === "wishlist");

	return (
		<div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
					Expansions{" "}
					{expansions.length > 0 && `(${expansions.length})`}
				</h3>
				{!showForm && (
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-150"
					>
						<Plus className="w-3.5 h-3.5" />
						Add
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
						inputClass={inputClass}
					/>

					<input
						type="text"
						value={form.name}
						onChange={(e) => updateField("name", e.target.value)}
						placeholder="Name *"
						required
						className={inputClass}
					/>

					<div className="grid grid-cols-2 gap-2">
						<input
							type="number"
							value={form.year_published}
							onChange={(e) =>
								updateField("year_published", e.target.value)
							}
							placeholder="Year"
							className={inputClass}
						/>
						<select
							value={form.status}
							onChange={(e) =>
								updateField("status", e.target.value)
							}
							className={inputClass}
						>
							<option value="owned">Owned</option>
							<option value="wishlist">Wishlist</option>
						</select>
					</div>

					<input
						type="text"
						value={form.notes}
						onChange={(e) => updateField("notes", e.target.value)}
						placeholder="Notes (optional)"
						className={inputClass}
					/>

					<div className="flex gap-2 pt-1">
						<button
							type="submit"
							disabled={saving}
							className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors duration-150"
						>
							<Check className="w-3.5 h-3.5" />
							{saving ? "Saving..." : "Save"}
						</button>
						<button
							type="button"
							onClick={() => {
								setShowForm(false);
								setForm(EMPTY_FORM);
							}}
							className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors duration-150"
						>
							<X className="w-3.5 h-3.5" />
							Cancel
						</button>
					</div>
				</form>
			)}

			{/* Expansion lists */}
			{loading ? (
				<p className="text-xs text-gray-400 dark:text-gray-500">
					Loading...
				</p>
			) : expansions.length === 0 ? (
				<p className="text-xs text-gray-400 dark:text-gray-500">
					No expansions added yet.
				</p>
			) : (
				<div className="space-y-3">
					{[
						{ label: "Owned", items: owned },
						{ label: "Wishlist", items: wishlist },
					].map(({ label, items }) =>
						items.length === 0 ? null : (
							<div key={label}>
								<p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
									{label}
								</p>
								<div className="space-y-1.5">
									{items.map((exp) => (
										<div
											key={exp.id}
											className="flex items-start justify-between gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
										>
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
													<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
														{exp.notes}
													</p>
												)}
											</div>
											{pendingRemove === exp.id ? (
												<div className="flex gap-1 shrink-0">
													<button
														onClick={() => {
															onRemove(exp.id);
															setPendingRemove(
																null,
															);
														}}
														className="text-xs text-red-500 hover:text-red-700 font-medium"
													>
														Remove
													</button>
													<button
														onClick={() =>
															setPendingRemove(
																null,
															)
														}
														className="text-xs text-gray-400 hover:text-gray-600"
													>
														Cancel
													</button>
												</div>
											) : (
												<button
													onClick={() =>
														setPendingRemove(exp.id)
													}
													className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 shrink-0"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</button>
											)}
										</div>
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
