import { useState, useCallback, useRef, useEffect } from "react";

const TOAST_DURATION = 3000;

export const useToast = () => {
	const [toasts, setToasts] = useState([]);
	const timersRef = useRef(new Map());
	const counterRef = useRef(0);

	useEffect(() => {
		return () => {
			timersRef.current.forEach((timer) => clearTimeout(timer));
			timersRef.current.clear();
		};
	}, []);

	const addToast = useCallback((message, type = "success") => {
		const id = ++counterRef.current;

		setToasts((prev) => [...prev, { id, message, type }]);

		const timer = setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
			timersRef.current.delete(id);
		}, TOAST_DURATION);

		timersRef.current.set(id, timer);
	}, []);

	const removeToast = useCallback((id) => {
		clearTimeout(timersRef.current.get(id));
		timersRef.current.delete(id);
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return { toasts, addToast, removeToast };
};
