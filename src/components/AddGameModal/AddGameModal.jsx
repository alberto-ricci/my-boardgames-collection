import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "../../i18n";
import BggSearch from "./BggSearch";
import CategoryInput from "./CategoryInput";

const EMPTY_FORM = {
	name: "",
	type: "",
	min_players: "",
	max_players: "",
	min_playtime: "",
	max_playtime: "",
	year_published: "",
	description: "",
	categories: [],
};

const gameToForm = (game) => ({
	name: game.name ?? "",
	type: game.type ?? "",
	min_players: game.min_players?.toString() ?? "",
	max_players: game.max_players?.toString() ?? "",
	min_playtime: game.min_playtime?.toString() ?? "",
	max_playtime: game.max_playtime?.toString() ?? "",
	year_published: game.year_published?.toString() ?? "",
	description: game.description ?? "",
	categories: game.categories ?? [],
});

const AddGameModal = ({
	mode,
	game,
	onClose,
	onSubmit,
	existingCategories = [],
}) => {
	const { t } = useLanguage();

	const isCollection = mode === "collection";
	const isEdit = mode === "edit";
	const isMove = mode === "move";
	const showFullForm = isCollection || isEdit || isMove;
	const showBggSearch = isCollection || isMove;

	const [form, setForm] = React.useState(
		(isEdit || isMove) && game ? gameToForm(game) : EMPTY_FORM,
	);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const updateField = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleBggSelect = (bggGame) => {
		if (mode === "wishlist") {
			setForm({ ...EMPTY_FORM, name: bggGame.name ?? "" });
		} else {
			setForm({
				name: bggGame.name ?? "",
				type: "Board Game",
				min_players: bggGame.min_players?.toString() ?? "",
				max_players: bggGame.max_players?.toString() ?? "",
				min_playtime: bggGame.min_playtime?.toString() ?? "",
				max_playtime: bggGame.max_playtime?.toString() ?? "",
				year_published: bggGame.year_published?.toString() ?? "",
				description: bggGame.description ?? "",
				categories: bggGame.categories ?? [],
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!form.name.trim()) {
			setError(t("add.error.name"));
			return;
		}

		setLoading(true);
		const { error } = await onSubmit(form);
		if (error) setError(error.message);
		else onClose();
		setLoading(false);
	};

	const getTitle = () => {
		if (isEdit) return t("edit.title");
		if (isMove || isCollection) return t("add.collection.title");
		return t("add.wishlist.title");
	};

	const getSubmitLabel = () => {
		if (loading) return isEdit ? t("edit.submitting") : t("add.submitting");
		if (isEdit) return t("edit.submit");
		if (isMove) return t("wishlist.move");
		if (isCollection) return t("add.submit.collection");
		return t("add.submit.wishlist");
	};

	const inputClass =
		"w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600";

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			/>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center p-4"
				initial={{ opacity: 0, scale: 0.97 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.97 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<div
					className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{getTitle()}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-150"
							aria-label={t("modal.close")}
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<form
						onSubmit={handleSubmit}
						className="px-6 py-5 space-y-4"
					>
						{/* BGG search */}
						{showBggSearch && (
							<BggSearch
								onSelect={handleBggSelect}
								inputClass={inputClass}
							/>
						)}

						{/* Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t("add.field.name")}{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={form.name}
								onChange={(e) =>
									updateField("name", e.target.value)
								}
								placeholder={t("add.field.name.placeholder")}
								className={inputClass}
							/>
						</div>

						{/* Collection / edit / move fields */}
						{showFullForm && (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										{t("add.field.type")}
									</label>
									<input
										type="text"
										value={form.type}
										onChange={(e) =>
											updateField("type", e.target.value)
										}
										placeholder={t(
											"add.field.type.placeholder",
										)}
										className={inputClass}
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											{t("add.field.min_players")}
										</label>
										<input
											type="number"
											min="1"
											value={form.min_players}
											onChange={(e) =>
												updateField(
													"min_players",
													e.target.value,
												)
											}
											className={inputClass}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											{t("add.field.max_players")}
										</label>
										<input
											type="number"
											min="1"
											value={form.max_players}
											onChange={(e) =>
												updateField(
													"max_players",
													e.target.value,
												)
											}
											className={inputClass}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											{t("add.field.min_playtime")}
										</label>
										<input
											type="number"
											min="1"
											value={form.min_playtime}
											onChange={(e) =>
												updateField(
													"min_playtime",
													e.target.value,
												)
											}
											className={inputClass}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											{t("add.field.max_playtime")}
										</label>
										<input
											type="number"
											min="1"
											value={form.max_playtime}
											onChange={(e) =>
												updateField(
													"max_playtime",
													e.target.value,
												)
											}
											className={inputClass}
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										{t("add.field.year")}
									</label>
									<input
										type="number"
										min="1800"
										max={new Date().getFullYear()}
										value={form.year_published}
										onChange={(e) =>
											updateField(
												"year_published",
												e.target.value,
											)
										}
										className={inputClass}
									/>
								</div>

								<CategoryInput
									categories={form.categories}
									existingCategories={existingCategories}
									onChange={(cats) =>
										updateField("categories", cats)
									}
									inputClass={inputClass}
								/>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										{t("add.field.description")}
									</label>
									<textarea
										value={form.description}
										onChange={(e) =>
											updateField(
												"description",
												e.target.value,
											)
										}
										placeholder={t(
											"add.field.description.placeholder",
										)}
										rows={3}
										className={`${inputClass} resize-none`}
									/>
								</div>
							</>
						)}

						{error && (
							<p className="text-red-500 text-sm">{error}</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors duration-200"
						>
							{getSubmitLabel()}
						</button>
					</form>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default AddGameModal;
