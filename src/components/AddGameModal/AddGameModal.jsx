import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
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

const INPUT_CLASS =
	"w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-colors duration-150";

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
	const isWishlist = mode === "wishlist";
	const showFullForm = isCollection || isEdit || isMove;
	const showBggSearch = isCollection || isMove || isWishlist;

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

	const updateField = useCallback((field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleBggSelect = useCallback(
		(bggGame) => {
			if (isWishlist) {
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
		},
		[isWishlist],
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!form.name.trim()) {
			setError(t("add.error.name"));
			return;
		}

		setLoading(true);
		const { error } = await onSubmit(form);
		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			onClose();
		}
	};

	const title = isEdit
		? t("edit.title")
		: isWishlist
			? t("add.wishlist.title")
			: t("add.collection.title");

	const submitLabel = isEdit
		? t("edit.submit")
		: isMove
			? t("wishlist.move")
			: isCollection
				? t("add.submit.collection")
				: t("add.submit.wishlist");

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
				initial={{ opacity: 0, scale: 0.97, y: 8 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.97, y: 8 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<div
					className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
						<h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
							{title}
						</h2>
						<button
							onClick={onClose}
							className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
							aria-label={t("modal.close")}
						>
							<X className="w-4 h-4" />
						</button>
					</div>

					<form
						onSubmit={handleSubmit}
						className="px-6 py-5 space-y-4"
					>
						{showBggSearch && (
							<BggSearch
								onSelect={handleBggSelect}
								inputClass={INPUT_CLASS}
							/>
						)}

						<FormField
							label={t("add.field.name")}
							required
						>
							<input
								type="text"
								value={form.name}
								onChange={(e) =>
									updateField("name", e.target.value)
								}
								placeholder={t("add.field.name.placeholder")}
								className={INPUT_CLASS}
								autoFocus={!showBggSearch}
							/>
						</FormField>

						{showFullForm && (
							<>
								<FormField label={t("add.field.type")}>
									<input
										type="text"
										value={form.type}
										onChange={(e) =>
											updateField("type", e.target.value)
										}
										placeholder={t(
											"add.field.type.placeholder",
										)}
										className={INPUT_CLASS}
									/>
								</FormField>

								<div className="grid grid-cols-2 gap-3">
									<FormField
										label={t("add.field.min_players")}
									>
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
											className={INPUT_CLASS}
										/>
									</FormField>
									<FormField
										label={t("add.field.max_players")}
									>
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
											className={INPUT_CLASS}
										/>
									</FormField>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<FormField
										label={t("add.field.min_playtime")}
									>
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
											className={INPUT_CLASS}
										/>
									</FormField>
									<FormField
										label={t("add.field.max_playtime")}
									>
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
											className={INPUT_CLASS}
										/>
									</FormField>
								</div>

								<FormField label={t("add.field.year")}>
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
										className={INPUT_CLASS}
									/>
								</FormField>

								<CategoryInput
									categories={form.categories}
									existingCategories={existingCategories}
									onChange={(cats) =>
										updateField("categories", cats)
									}
									inputClass={INPUT_CLASS}
								/>

								<FormField label={t("add.field.description")}>
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
										className={`${INPUT_CLASS} resize-none`}
									/>
								</FormField>
							</>
						)}

						{error && (
							<div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<p className="text-red-600 dark:text-red-400 text-sm">
									{error}
								</p>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
						>
							{loading && (
								<Loader2 className="w-4 h-4 animate-spin" />
							)}
							{loading
								? isEdit
									? t("edit.submitting")
									: t("add.submitting")
								: submitLabel}
						</button>
					</form>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default AddGameModal;
