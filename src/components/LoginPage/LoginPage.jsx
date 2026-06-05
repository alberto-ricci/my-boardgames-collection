import React, { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../i18n";

const INPUT_CLASS =
	"w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-colors duration-150";

const LoginPage = () => {
	const { t } = useLanguage();
	const [mode, setMode] = useState("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [loading, setLoading] = useState(false);

	const isLogin = mode === "login";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (!isLogin && password !== confirmPassword) {
			setError(t("login.error.password_mismatch"));
			return;
		}

		setLoading(true);

		if (isLogin) {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) setError(error.message);
		} else {
			const { error } = await supabase.auth.signUp({ email, password });
			if (error) {
				setError(error.message);
			} else {
				setMessage(
					"Account created. Check your email to confirm before signing in.",
				);
			}
		}

		setLoading(false);
	};

	const toggleMode = useCallback(() => {
		setMode((prev) => (prev === "login" ? "signup" : "login"));
		setError(null);
		setMessage(null);
		setEmail("");
		setPassword("");
		setConfirmPassword("");
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-sm p-8 shadow-sm">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="text-5xl mb-4">🎲</div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{t("login.title")}
					</h1>
					<p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
						{isLogin
							? t("login.subtitle.login")
							: t("login.subtitle.signup")}
					</p>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
							{t("login.email")}
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
							placeholder="you@example.com"
							className={INPUT_CLASS}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
							{t("login.password")}
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete={
								isLogin ? "current-password" : "new-password"
							}
							placeholder="••••••••"
							className={INPUT_CLASS}
						/>
					</div>

					{!isLogin && (
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
								{t("login.confirm_password")}
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
								autoComplete="new-password"
								placeholder="••••••••"
								className={INPUT_CLASS}
							/>
						</div>
					)}

					{error && (
						<div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-red-600 dark:text-red-400 text-sm">
								{error}
							</p>
						</div>
					)}

					{message && (
						<div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
							<p className="text-green-700 dark:text-green-400 text-sm">
								{message}
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
							? isLogin
								? t("login.signing_in")
								: t("login.creating")
							: isLogin
								? t("login.signin")
								: t("login.signup")}
					</button>
				</form>

				{/* Toggle mode */}
				<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
					{isLogin ? t("login.no_account") : t("login.has_account")}{" "}
					<button
						onClick={toggleMode}
						className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-150 focus:outline-none focus:underline"
					>
						{isLogin ? t("login.signup") : t("login.signin")}
					</button>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
