import React from "react";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../i18n";

const LoginPage = () => {
	const { t } = useLanguage();
	const [mode, setMode] = React.useState("login");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [error, setError] = React.useState(null);
	const [message, setMessage] = React.useState(null);
	const [loading, setLoading] = React.useState(false);

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
			if (error) setError(error.message);
			else
				setMessage(
					"Account created. Check your email to confirm before signing in.",
				);
		}

		setLoading(false);
	};

	const toggleMode = () => {
		setMode((prev) => (prev === "login" ? "signup" : "login"));
		setError(null);
		setMessage(null);
		setEmail("");
		setPassword("");
		setConfirmPassword("");
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-sm p-8">
				<div className="text-center mb-8">
					<div className="text-5xl mb-3">🎲</div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						{t("login.title")}
					</h1>
					<p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
						{isLogin
							? t("login.subtitle.login")
							: t("login.subtitle.signup")}
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							{t("login.email")}
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							{t("login.password")}
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
							placeholder="••••••••"
						/>
					</div>

					{!isLogin && (
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t("login.confirm_password")}
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
								className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
								placeholder="••••••••"
							/>
						</div>
					)}

					{error && <p className="text-red-500 text-sm">{error}</p>}
					{message && (
						<p className="text-green-600 dark:text-green-400 text-sm">
							{message}
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors duration-200"
					>
						{loading
							? isLogin
								? t("login.signing_in")
								: t("login.creating")
							: isLogin
								? t("login.signin")
								: t("login.signup")}
					</button>
				</form>

				<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
					{isLogin ? t("login.no_account") : t("login.has_account")}{" "}
					<button
						onClick={toggleMode}
						className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
					>
						{isLogin ? t("login.signup") : t("login.signin")}
					</button>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
