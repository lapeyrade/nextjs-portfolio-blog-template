"use client";

import { useReportWebVitals } from "next/web-vitals";

type SerializableRecord = Record<string, unknown>;

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

function sendToAnalytics(metric: SerializableRecord): void {
	try {
		// Build a minimal, non-PII payload
		const payload: SerializableRecord = {
			name: String(metric.name || "").slice(0, 64),
			value: typeof metric.value === "number" ? metric.value : undefined,
			delta: typeof metric.delta === "number" ? metric.delta : undefined,
			id: metric.id ? String(metric.id).slice(0, 256) : undefined,
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

	useReportWebVitals((metric) => {
		// Metric is a typed object from Next.js; we serialize a minimal superset for transport
		// and avoid leaking PII beyond standard UA + URL
		try {
			if (Math.random() <= SAMPLE_RATE) {
				sendToAnalytics(metric as unknown as SerializableRecord);
			} else if (process.env.NODE_ENV === "development") {
				// Log in dev so developers still see metrics locally
				console.debug("[WebVitals] sampled out", metric);
			}
		} catch (e) {
			if (process.env.NODE_ENV === "development")
				console.error("[WebVitals] sampling error", e);
		}
	});

	return null;
}
