import { useEffect, useRef } from "react";

const useDebounce = (
	callback: (...args: unknown[]) => unknown,
	delay: number
) => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const debouncedCallback = (...args: unknown[]) => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};

	return debouncedCallback;
};

export default useDebounce;
