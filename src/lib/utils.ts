import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { toast } from "svelte-sonner";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const task = <T, E>(promise: Promise<T>): Promise<{ error: null | E, data: null | T }> => {
	return promise
		.then(data => ({ error: null, data }))
		.catch(error => ({ error, data: null }))
};

export const errorToast = (message: string, ex: unknown, extra: { [key: string]: string } = {}) => {
	if (typeof ex === "string") {
		toast(message + ": " + ex);
	} else if (ex instanceof Error) {
		toast(message + ": " + " [" + ex.name + "] " + ex.message);
	}

	if (Object.keys(extra).length != 0) {
		console.group();
		console.error(message, ex);
		console.debug("extra data", JSON.stringify(extra));
		console.groupEnd();
	} else {
		console.error(message, ex);
	}

	return null;
};

export const wrapError = <T>(message: string, func: () => T): T | null => {
	try {
		return func();
	} catch (ex: unknown) {
		return errorToast(message, ex);
	}
};

export const wrapAsyncError = async <T>(message: string, func: () => Promise<T>): Promise<T | null> => {
	try {
		return await func();
	} catch (ex: unknown) {
		return errorToast(message, ex);
	}
};

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
