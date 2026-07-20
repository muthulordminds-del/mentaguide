import advertiserModel from "../models/advertiserModel.js";
import { appendToSheet } from "../config/googleSheets.js";
import transporter from "../config/nodemailer.js";
import { REGISTRATION_PENDING_TEMPLATE } from "../config/emailTemplates.js";

// ---------------------------------------------------------------
// STEP 0: Save the event-registration form.
// Saved to MongoDB AND to the Google Sheet immediately (status:
// "pending"), before payment is even attempted.
//
// A "Registration Received" email is also sent right here — it
// contains a payment link so the advertiser can pay whenever they
// want. This is the ONLY email sent at this stage. Once they
// actually complete (or fail) the payment, paymentController.js
// sends a separate success/failure email and updates the SAME
// Google Sheet row (not a duplicate).
// ---------------------------------------------------------------
export const createAdvertiser = async (req, res) => {
    try {
        const advertiserData = req.body;

        const newAdvertiser = new advertiserModel(advertiserData);
        await newAdvertiser.save();

        // Create the initial "pending" row in the Google Sheet.
        // Non-blocking for the user response: if this fails, the
        // registration itself still succeeds and the sheet gets
        // caught up automatically on the next payment status update
        // (see updateSheetRow's fallback-to-append behaviour).
        try {
            await appendToSheet(newAdvertiser.toObject());
        } catch (sheetError) {
            console.error("Error appending initial registration to Google Sheet:", sheetError);
        }

        // Send registration-received email with a payment link.
        // NOTE: update CLIENT_URL / the "/complete-payment" path below
        // to match your actual frontend route that renders PaymentStep.
        try {
            const paymentLink = `${process.env.CLIENT_URL}/complete-payment/${newAdvertiser._id}`;
            await transporter.sendMail({
                from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
                to: newAdvertiser.email,
                subject: "Registration Received - Complete Your Payment - Mentaguide Expand 360²",
                html: REGISTRATION_PENDING_TEMPLATE
                    .replace(/{{fullName}}/g, newAdvertiser.fullName || "")
                    .replace(/{{paymentLink}}/g, paymentLink),
            });
        } catch (mailError) {
            console.error("Error sending registration confirmation email:", mailError);
        }

        return res.json({
            success: true,
            message: "Advertiser signup form submitted successfully!",
            advertiserId: newAdvertiser._id
        });
    } catch (error) {
        console.error("Error creating advertiser:", error);
        return res.json({
            success: false,
            message: error.message || "Error submitting form"
        });
    }
};