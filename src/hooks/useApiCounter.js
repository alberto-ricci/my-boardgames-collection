const STORAGE_KEY = "meepleit_usage";
const MONTHLY_LIMIT = 200;
const WARNING_THRESHOLD = 10;

const getStoredUsage = () => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return { count: 0, month: getCurrentMonth() };
		return JSON.parse(stored);
	} catch {
		return { count: 0, month: getCurrentMonth() };
	}
};

const getCurrentMonth = () => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth()}`;
};

const saveUsage = (data) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useApiCounter = () => {
	const getUsage = () => {
		const stored = getStoredUsage();
		// Reset if new month
		if (stored.month !== getCurrentMonth()) {
			const fresh = { count: 0, month: getCurrentMonth() };
			saveUsage(fresh);
			return fresh;
		}
		return stored;
	};

	const increment = () => {
		const usage = getUsage();
		const updated = { ...usage, count: usage.count + 1 };
		saveUsage(updated);
		return updated;
	};

	const remaining = () => {
		const usage = getUsage();
		return MONTHLY_LIMIT - usage.count;
	};

	const isExhausted = () => remaining() <= 0;

	const isWarning = () => remaining() <= WARNING_THRESHOLD;

	return { increment, remaining, isExhausted, isWarning };
};
