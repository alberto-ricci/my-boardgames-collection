import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Loader2 } from "lucide-react";
import { useLanguage } from "../../i18n";

const MAX_FILE_SIZE_MB = 2;
const MAX_DIMENSION = 400;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const INPUT_CLASS =
	"w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-colors duration-150";

const resizeImage = (file, maxDimension) =>
	new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(url);
			const scale = Math.min(
				maxDimension / img.width,
				maxDimension / img.height,
				1,
			);
			const width = Math.round(img.width * scale);
			const height = Math.round(img.height * scale);

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.getContext("2d").drawImage(img, 0, 0, width, height);

			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error("Canvas toBlob failed"));
						return;
					}
					resolve(
						new File([blob], file.name, { type: "image/jpeg" }),
					);
				},
				"image/jpeg",
				0.85,
			);
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to load image"));
		};

		img.src = url;
	});

const ProfilePage = ({ userId, profile, updateProfile, isSetup = false }) => {
	const navigate = useNavigate();
	const { t } = useLanguage();
	const [username, setUsername] = useState(profile?.username || "");
	const [avatarFile, setAvatarFile] = useState(null);
	const [preview, setPreview] = useState(profile?.avatar_url || null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleAvatarChange = useCallback(
		async (e) => {
			const file = e.target.files[0];
			if (!file) return;
			setError(null);

			if (!ALLOWED_TYPES.includes(file.type)) {
				setError(t("profile.error.format"));
				return;
			}
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				setError(t("profile.error.size"));
				return;
			}

			try {
				const resized = await resizeImage(file, MAX_DIMENSION);
				setAvatarFile(resized);
				setPreview(URL.createObjectURL(resized));
			} catch {
				setError(t("profile.error.format"));
			}
		},
		[t],
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const { error } = await updateProfile({ username, avatarFile });
		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			navigate("/");
		}
	};

	const handleCancel = useCallback(() => navigate("/"), [navigate]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-sm p-8 shadow-sm">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="text-5xl mb-4">🎲</div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{isSetup
							? t("profile.setup.title")
							: t("profile.edit.title")}
					</h1>
					{isSetup && (
						<p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
							{t("profile.setup.subtitle")}
						</p>
					)}
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6"
				>
					{/* Avatar */}
					<div className="flex flex-col items-center gap-3">
						<div className="relative">
							<div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600">
								{preview ? (
									<img
										src={preview}
										alt="Avatar preview"
										className="w-full h-full object-cover"
									/>
								) : (
									<span className="text-4xl">👤</span>
								)}
							</div>
							<label
								htmlFor="avatar-upload"
								className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg p-1.5 cursor-pointer transition-colors duration-150 focus-within:ring-2 focus-within:ring-blue-400"
								title={t("profile.avatar.hint")}
							>
								<Camera className="w-3.5 h-3.5" />
							</label>
							<input
								id="avatar-upload"
								type="file"
								accept="image/jpeg,image/png,image/webp"
								onChange={handleAvatarChange}
								className="hidden"
							/>
						</div>
						<p className="text-xs text-gray-400 dark:text-gray-500">
							{t("profile.avatar.hint")}
						</p>
					</div>

					{/* Username */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
							{t("profile.username")}
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoComplete="username"
							placeholder="your username"
							className={INPUT_CLASS}
						/>
					</div>

					{/* Error */}
					{error && (
						<div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-red-600 dark:text-red-400 text-sm">
								{error}
							</p>
						</div>
					)}

					{/* Submit */}
					<button
						type="submit"
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
					>
						{loading && (
							<Loader2 className="w-4 h-4 animate-spin" />
						)}
						{loading
							? t("profile.saving")
							: isSetup
								? t("profile.get_started")
								: t("profile.save")}
					</button>

					{/* Cancel */}
					{!isSetup && (
						<button
							type="button"
							onClick={handleCancel}
							className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 active:text-gray-900 transition-colors duration-150 focus:outline-none focus:underline"
						>
							{t("profile.cancel")}
						</button>
					)}
				</form>
			</div>
		</div>
	);
};

export default ProfilePage;
