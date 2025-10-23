"use client";

import { useTranslations } from "next-intl";
import { type FormEvent, useEffect, useId, useState } from "react";
import {
	AnimatedButton,
	StaggerContainer,
	StaggerItem,
} from "@/components/animations";

interface FormData {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string; // Honeypot field
}

interface FormErrors {
	name?: string;
	email?: string;
	subject?: string;
	message?: string;
	website?: string;
}

export default function ContactForm() {
	const t = useTranslations("contact_form");
	const tValidation = useTranslations("validation");

	// Generate unique IDs for form elements and status messages
	const nameId = useId();
	const emailId = useId();
	const subjectId = useId();
	const messageId = useId();
	const websiteId = useId();
	const successStatusId = useId();
	const errorStatusId = useId();

	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		subject: "",
		message: "",
		website: "", // Honeypot field - should remain empty
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
		null,
	);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Warn on unsaved changes before navigation
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges]);

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		// Name validation
		if (!formData.name.trim()) {
			newErrors.name = tValidation("required_field");
		} else if (formData.name.trim().length < 2) {
			newErrors.name = tValidation("min_length", { min: 2 });
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formData.email.trim()) {
			newErrors.email = tValidation("required_field");
		} else if (!emailRegex.test(formData.email)) {
			newErrors.email = tValidation("invalid_email");
		}

		// Subject validation
		if (!formData.subject.trim()) {
			newErrors.subject = tValidation("required_field");
		} else if (formData.subject.trim().length < 5) {
			newErrors.subject = tValidation("min_length", { min: 5 });
		}

		// Message validation
		if (!formData.message.trim()) {
			newErrors.message = tValidation("required_field");
		} else if (formData.message.trim().length < 10) {
			newErrors.message = tValidation("min_length", { min: 10 });
		}

		setErrors(newErrors);

		// Focus first error field on submit
		if (Object.keys(newErrors).length > 0) {
			const firstErrorField = Object.keys(newErrors)[0] as keyof FormErrors;
			const errorElement = document.getElementById(
				firstErrorField === "name"
					? nameId
					: firstErrorField === "email"
						? emailId
						: firstErrorField === "subject"
							? subjectId
							: messageId,
			);
			errorElement?.focus();
		}

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus(null);

		// Generate idempotency key for this submission
		const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Idempotency-Key": idempotencyKey,
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok) {
				setSubmitStatus("success");
				setFormData({
					name: "",
					email: "",
					subject: "",
					message: "",
					website: "",
				});
				setErrors({});
				setHasUnsavedChanges(false);
				console.log("Form submitted successfully:", result);
			} else {
				setSubmitStatus("error");
				console.error("Form submission failed:", result.error);
			}
		} catch (error) {
			setSubmitStatus("error");
			console.error("Form submission error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setHasUnsavedChanges(true);
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<StaggerContainer>
				<form
					onSubmit={handleSubmit}
					className="space-y-6"
					aria-busy={isSubmitting}
					aria-describedby="contact-status"
				>
					{/* Name Field */}
					<StaggerItem>
						<div>
							<label
								htmlFor={nameId}
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								{t("name_label")}
							</label>
							<input
								type="text"
								id={nameId}
								name="name"
								value={formData.name}
								onChange={(e) => handleChange("name", e.target.value)}
								autoComplete="name"
								aria-invalid={!!errors.name}
								aria-describedby={errors.name ? `${nameId}-error` : undefined}
								className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors text-base ${
									errors.name
										? "border-red-500 focus:ring-red-500"
										: "border-gray-600 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
								}`}
								placeholder={t("name_placeholder")}
							/>
							{errors.name && (
								<p id={`${nameId}-error`} className="mt-2 text-sm text-red-400">
									{errors.name}
								</p>
							)}
						</div>
					</StaggerItem>

					{/* Email Field */}
					<StaggerItem>
						<div>
							<label
								htmlFor={emailId}
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								{t("email_label")}
							</label>
							<input
								type="email"
								id={emailId}
								name="email"
								value={formData.email}
								onChange={(e) => handleChange("email", e.target.value)}
								autoComplete="email"
								inputMode="email"
								spellCheck="false"
								aria-invalid={!!errors.email}
								aria-describedby={
									errors.email ? `${emailId}-error` : undefined
								}
								className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors text-base ${
									errors.email
										? "border-red-500 focus:ring-red-500"
										: "border-gray-600 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
								}`}
								placeholder={t("email_placeholder")}
							/>
							{errors.email && (
								<p id={`${emailId}-error`} className="mt-2 text-sm text-red-400">
									{errors.email}
								</p>
							)}
						</div>
					</StaggerItem>

					{/* Subject Field */}
					<StaggerItem>
						<div>
							<label
								htmlFor={subjectId}
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								{t("subject_label")}
							</label>
							<input
								type="text"
								id={subjectId}
								name="subject"
								value={formData.subject}
								onChange={(e) => handleChange("subject", e.target.value)}
								autoComplete="off"
								aria-invalid={!!errors.subject}
								aria-describedby={
									errors.subject ? `${subjectId}-error` : undefined
								}
								className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors text-base ${
									errors.subject
										? "border-red-500 focus:ring-red-500"
										: "border-gray-600 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
								}`}
								placeholder={t("subject_placeholder")}
							/>
							{errors.subject && (
								<p
									id={`${subjectId}-error`}
									className="mt-2 text-sm text-red-400"
								>
									{errors.subject}
								</p>
							)}
						</div>
					</StaggerItem>

					{/* Message Field */}
					<StaggerItem>
						<div>
							<label
								htmlFor={messageId}
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								{t("message_label")}
							</label>
							<textarea
								id={messageId}
								name="message"
								rows={6}
								value={formData.message}
								onChange={(e) => handleChange("message", e.target.value)}
								autoComplete="off"
								aria-invalid={!!errors.message}
								aria-describedby={
									errors.message ? `${messageId}-error` : undefined
								}
								className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none text-base ${
									errors.message
										? "border-red-500 focus:ring-red-500"
										: "border-gray-600 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
								}`}
								placeholder={t("message_placeholder")}
							/>
							{errors.message && (
								<p
									id={`${messageId}-error`}
									className="mt-2 text-sm text-red-400"
								>
									{errors.message}
								</p>
							)}
						</div>
					</StaggerItem>

					{/* Honeypot Field - Hidden from users, visible to bots */}
					<div style={{ display: "none" }}>
						<label htmlFor={websiteId}>Website (leave blank):</label>
						<input
							type="text"
							id={websiteId}
							name="website"
							value={formData.website}
							onChange={(e) => handleChange("website", e.target.value)}
							tabIndex={-1}
							autoComplete="off"
							aria-hidden="true"
						/>
					</div>

					{/* Submit Button */}
					<StaggerItem>
						<AnimatedButton
							type="submit"
							disabled={isSubmitting}
							className="w-full btn-accent text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center">
									<svg
										className="animate-spin motion-reduce:animate-none -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										aria-hidden="true"
										focusable="false"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									{t("submit_button")}…
								</span>
							) : (
								t("submit_button")
							)}
						</AnimatedButton>
					</StaggerItem>
				</form>

				{/* Status Messages - Outside form for better visibility */}
				{submitStatus === "success" && (
					<output
						className="block p-4 bg-green-800/20 border border-green-600 rounded-lg mt-6 animate-in fade-in slide-in-from-top-4 duration-500"
						id={successStatusId}
						aria-live="polite"
					>
						<p className="text-green-400 text-center flex items-center justify-center gap-2">
							<svg
								className="w-5 h-5 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{t("success_message")}</span>
						</p>
					</output>
				)}

				{submitStatus === "error" && (
					<output
						className="block p-4 bg-red-800/20 border border-red-600 rounded-lg mt-6 animate-in fade-in slide-in-from-top-4 duration-500"
						id={errorStatusId}
						aria-live="assertive"
					>
						<p className="text-red-400 text-center flex items-center justify-center gap-2">
							<svg
								className="w-5 h-5 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{t("error_message")}</span>
						</p>
					</output>
				)}
			</StaggerContainer>
		</div>
	);
}
