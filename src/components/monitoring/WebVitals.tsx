"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useEffect } from "react";

type SerializableRecord = Record<string, unknown>;
type MinimalMetric = {
	name: string;
	value?: number;
	delta?: number;
	id?: string;
	rating?: string;
	navigationType?: string;
};

// Client-side batching to reduce network churn. Flush interval and batch size configurable.
const BATCH_FLUSH_INTERVAL_MS = 10_000; // 10s
const BATCH_MAX_ITEMS = 10;
const metricBatch: SerializableRecord[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
	if (flushTimer) return;
	flushTimer = setTimeout(() => {
		flushTimer = null;
		void flushBatch();
	}, BATCH_FLUSH_INTERVAL_MS);
}

async function flushBatch(): Promise<void> {
	if (metricBatch.length === 0) return;
	const batch = metricBatch.splice(0, metricBatch.length);
	try {
		const body = JSON.stringify({ items: batch });
		if (
			typeof navigator !== "undefined" &&
			typeof navigator.sendBeacon === "function"
		) {
			const blob = new Blob([body], { type: "application/json" });
			navigator.sendBeacon("/api/web-vitals", blob);
		} else {
			await fetch("/api/web-vitals", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body,
				keepalive: true,
			});
		}
		if (process.env.NODE_ENV === "development")
			console.log("[WebVitals] flushed", batch);
	} catch (err) {
		if (process.env.NODE_ENV === "development")
			console.error("[WebVitals] flush failed", err);
	}
}

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

function sendToAnalytics(metric: MinimalMetric): void {
	try {
		// Build a minimal, non-PII payload per Next.js 15.5 guidance
		const payload: SerializableRecord = {
			name: String(metric.name || "").slice(0, 64),
			value: typeof metric.value === "number" ? metric.value : undefined,
			delta: typeof metric.delta === "number" ? metric.delta : undefined,
			id: metric.id ? String(metric.id).slice(0, 256) : undefined,
			rating: metric.rating ? String(metric.rating).slice(0, 16) : undefined,
			navigationType: metric.navigationType
				? String(metric.navigationType).slice(0, 32)
				: undefined,
			ts: Date.now(),
			path:
				typeof window !== "undefined" ? window.location.pathname : undefined,
			ua_snippet:
				typeof navigator !== "undefined" && navigator.userAgent
					? String(navigator.userAgent).slice(0, 128)
					: undefined,
		};

		metricBatch.push(payload);
		if (metricBatch.length >= BATCH_MAX_ITEMS) {
			void flushBatch();
		} else {
			scheduleFlush();
		}

		if (process.env.NODE_ENV === "development") {
			console.debug("[WebVitals] queued", payload);
		}
	} catch (error) {
		if (process.env.NODE_ENV === "development")
			console.error("[WebVitals] Failed to queue metric", error);
	}
}

export default function WebVitals(): null {
	// Sampling rate (0-1). Default to 0.05 (5%) to avoid high traffic.
	const SAMPLE_RATE =
		typeof process !== "undefined" && process.env.NEXT_PUBLIC_WEBVITALS_SAMPLE
			? Number(process.env.NEXT_PUBLIC_WEBVITALS_SAMPLE)
			: 0.05;

	// Use a stable, typed callback as recommended
	const handleWebVitals: ReportWebVitalsCallback = (metric) => {
		// Metric is a typed object from Next.js; we serialize a minimal superset for transport
		// and avoid leaking PII beyond standard UA + URL
		try {
			if (Math.random() <= SAMPLE_RATE) {
				const minimal: MinimalMetric = { name: String(metric.name) };
				if (typeof metric.value === "number") minimal.value = metric.value;
				if (typeof metric.delta === "number") minimal.delta = metric.delta;
				if (typeof metric.id === "string") minimal.id = metric.id;
				const maybeRating = (metric as unknown as { rating?: unknown }).rating;
				if (typeof maybeRating === "string") minimal.rating = maybeRating;
				const maybeNavType = (metric as unknown as { navigationType?: unknown })
					.navigationType;
				if (typeof maybeNavType === "string")
					minimal.navigationType = maybeNavType;

				sendToAnalytics(minimal);
			} else if (process.env.NODE_ENV === "development") {
				// Log in dev so developers still see metrics locally
				console.debug("[WebVitals] sampled out", metric);
			}
		} catch (e) {
			if (process.env.NODE_ENV === "development")
				console.error("[WebVitals] sampling error", e);
		}
	};

	useReportWebVitals(handleWebVitals);

	// Ensure pending metrics are flushed on page lifecycle events
	useEffect(() => {
		const flush = () => {
			void flushBatch();
		};
		const onVisibilityChange = () => {
			if (document.visibilityState === "hidden") flush();
		};
		window.addEventListener("pagehide", flush);
		window.addEventListener("beforeunload", flush);
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => {
			window.removeEventListener("pagehide", flush);
			window.removeEventListener("beforeunload", flush);
			document.removeEventListener("visibilitychange", onVisibilityChange);
			void flushBatch();
		};
	}, []);

	return null;
}
