import React from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useLanguage } from "../../i18n";

const MAX_FILE_SIZE_MB = 2;
const MAX_DIMENSION = 400;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const resizeImage = (file, maxDimension) => {
	return new Promise((resolve) => {
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
				(blob) =>
					resolve(
						new File([blob], file.name, { type: "image/jpeg" }),
					),
				"image/jpeg",
				0.85,
			);
		};

		img.src = url;
	});
};

const ProfilePage = ({ userId, profile, updateProfile, isSetup = false }) => {
	const navigate = useNavigate();
	const { t } = useLanguage();
	const [username, setUsername] = React.useState(profile?.username || "");
	const [avatarFile, setAvatarFile] = React.useState(null);
	const [preview, setPreview] = React.useState(profile?.avatar_url || null);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(false);

	const handleAvatarChange = async (e) => {
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

		const resized = await resizeImage(file, MAX_DIMENSION);
		setAvatarFile(resized);
		setPreview(URL.createObjectURL(resized));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const { error } = await updateProfile({ username, avatarFile });
		if (error) setError(error.message);
		else navigate("/");

		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-sm p-8">
				<div className="text-center mb-8">
					<div className="text-5xl mb-3">🎲</div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{isSetup
							? t("profile.setup.title")
							: t("profile.edit.title")}
					</h1>
					{isSetup && (
						<p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
							{t("profile.setup.subtitle")}
						</p>
					)}
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6"
				>
					<div className="flex flex-col items-center gap-3">
						<div className="relative">
							<div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
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
								className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-md p-1.5 cursor-pointer transition-colors duration-200"
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

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							{t("profile.username")}
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
							placeholder="your username"
						/>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors duration-200"
					>
						{loading
							? t("profile.saving")
							: isSetup
								? t("profile.get_started")
								: t("profile.save")}
					</button>

					{!isSetup && (
						<button
							type="button"
							onClick={() => navigate("/")}
							className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
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
