import { useCallback } from "react";

const STORAGE_KEY = "meepleit_usage";
const MONTHLY_LIMIT = 200;
const WARNING_THRESHOLD = 10;

const getCurrentMonth = () => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth() + 1}`;
};

const getUsage = () => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		const currentMonth = getCurrentMonth();

		if (!parsed || parsed.month !== currentMonth) {
			const fresh = { count: 0, month: currentMonth };
			localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
			return fresh;
		}

		return parsed;
	} catch {
		return { count: 0, month: getCurrentMonth() };
	}
};

const saveUsage = (data) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		console.warn("Could not save API usage to localStorage.");
	}
};

export const useApiCounter = () => {
	const increment = useCallback(() => {
		const usage = getUsage();
		saveUsage({ ...usage, count: usage.count + 1 });
	}, []);

	const remaining = useCallback(() => {
		return MONTHLY_LIMIT - getUsage().count;
	}, []);

	const isExhausted = useCallback(() => remaining() <= 0, [remaining]);

	const isWarning = useCallback(
		() => remaining() <= WARNING_THRESHOLD,
		[remaining],
	);

	return { increment, remaining, isExhausted, isWarning };
};
