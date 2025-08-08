'use client'

import { useState, FormEvent } from 'react'
import { StaggerContainer, StaggerItem, AnimatedButton } from '@/components/animations'

interface FormData {
    name: string
    email: string
    subject: string
    message: string
    website: string // Honeypot field
}

interface FormErrors {
    name?: string
    email?: string
    subject?: string
    message?: string
    website?: string
}

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '' // Honeypot field - should remain empty
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Subject validation
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required'
        } else if (formData.subject.trim().length < 5) {
            newErrors.subject = 'Subject must be at least 5 characters'
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required'
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (response.ok) {
                setSubmitStatus('success')
                setFormData({ name: '', email: '', subject: '', message: '', website: '' })
                setErrors({})
                console.log('Form submitted successfully:', result)
            } else {
                setSubmitStatus('error')
                console.error('Form submission failed:', result.error)
            }

        } catch (error) {
            setSubmitStatus('error')
            console.error('Form submission error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <StaggerContainer>
                <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isSubmitting} aria-describedby="contact-status">
                    {/* Name Field */}
                    <StaggerItem>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.name
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>
                    </StaggerItem>

                    {/* Email Field */}
                    <StaggerItem>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.email
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                                    }`}
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>
                    </StaggerItem>

                    {/* Subject Field */}
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.subject
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                                }`}
                            placeholder="What's this about?"
                        />
                        {errors.subject && (
                            <p className="mt-2 text-sm text-red-400">{errors.subject}</p>
                        )}
                    </div>

                    {/* Message Field */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={6}
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none ${errors.message
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                                }`}
                            placeholder="Tell me about your project or idea..."
                        />
                        {errors.message && (
                            <p className="mt-2 text-sm text-red-400">{errors.message}</p>
                        )}
                    </div>

                    {/* Honeypot Field - Hidden from users, visible to bots */}
                    <div style={{ display: 'none' }}>
                        <label htmlFor="website">Website (leave blank):</label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={(e) => handleChange('website', e.target.value)}
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
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin motion-reduce:animate-none -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending Message...
                                </span>
                            ) : (
                                'Send Message'
                            )}
                        </AnimatedButton>
                    </StaggerItem>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                        <div className="p-4 bg-green-800/20 border border-green-600 rounded-lg" role="status" id="contact-status" aria-live="polite">
                            <p className="text-green-400 text-center">
                                ✅ Thank you! Your message has been sent successfully. I&apos;ll get back to you soon.
                            </p>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="p-4 bg-red-800/20 border border-red-600 rounded-lg" role="status" id="contact-status" aria-live="assertive">
                            <p className="text-red-400 text-center">
                                ❌ Sorry, there was an error sending your message. Please try again.
                            </p>
                        </div>
                    )}
                </form>
            </StaggerContainer>
        </div>
    )
}
