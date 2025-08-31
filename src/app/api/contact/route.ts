import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, subject, message, website } = body;

		// Honeypot check - if website field is filled, it's likely spam
		if (website && website.trim() !== "") {
			console.log("Honeypot triggered - potential spam detected:", {
				website,
				userAgent: request.headers.get("user-agent"),
				timestamp: new Date().toISOString(),
			});
			return NextResponse.json({ error: "Spam detected" }, { status: 400 });
		}

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 },
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 },
			);
		}

		// Log the contact form submission
		console.log("Contact form submission:", {
			name,
			email,
			subject,
			message,
			timestamp: new Date().toISOString(),
		});

		// Send email using Resend
		try {
			const emailData = await resend.emails.send({
				from: process.env.FROM_EMAIL || "onboarding@resend.dev",
				to: process.env.CONTACT_EMAIL || "sylvain.lapeyrade@hotmail.fr",
				subject: `Portfolio Contact: ${subject}`,
				html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6b46c1; border-bottom: 2px solid #6b46c1; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #6b46c1;">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #6b46c1; border-radius: 4px;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>Sent from your portfolio contact form</p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
				// Also send a plain text version
				text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent from your portfolio contact form
Timestamp: ${new Date().toLocaleString()}
        `,
			});

			console.log("Email sent successfully:", emailData);

			return NextResponse.json({
				success: true,
				message: "Thank you for your message! I will get back to you soon.",
				emailId: emailData.data?.id,
			});
		} catch (emailError) {
			console.error("Email sending failed:", emailError);

			// Return a user-friendly error message
			return NextResponse.json(
				{
					error:
						"Failed to send email. Please try again or contact me directly.",
				},
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Contact form error:", error);
		return NextResponse.json(
			{ error: "Failed to process your message. Please try again." },
			{ status: 500 },
		);
	}
}
