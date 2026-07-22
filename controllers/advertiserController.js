import advertiserModel from "../models/advertiserModel.js";
import { appendToSheet } from "../config/googleSheets.js";
import transporter from "../config/nodemailer.js";
import { REGISTRATION_PENDING_TEMPLATE } from "../config/emailTemplates.js";
import { sendWhatsappMessage } from "../config/whatsapp.js";

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

        // Send registration-received WhatsApp message with the same
        // payment link. Non-blocking: if this fails, the registration
        // and email above are unaffected — only the WhatsApp send is
        // skipped, and it's logged for follow-up.
        try {
            const paymentLink = `${process.env.CLIENT_URL}/complete-payment/${newAdvertiser._id}`;
            await sendWhatsappMessage(
                newAdvertiser.whatsapp,
                `Hi ${newAdvertiser.fullName}, thanks for registering for Mentaguide Expand 360²! Complete your payment here: ${paymentLink}`
            );
        } catch (waError) {
            console.error("Error sending registration WhatsApp message:", waError);
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

// ---------------------------------------------------------------
// Fetch a single advertiser's registration by Mongo _id.
// Used by the CompletePayment.jsx page (the /complete-payment/:id
// route the email/WhatsApp payment link points to) to reload the
// advertiser's data fresh, since no state is carried over when the
// user arrives from an external link.
// ---------------------------------------------------------------
export const getAdvertiserById = async (req, res) => {
    try {
        const { id } = req.params;
        const advertiser = await advertiserModel.findById(id);

        if (!advertiser) {
            return res.json({ success: false, message: "Registration not found." });
        }

        return res.json({
            success: true,
            advertiser: {
                advertiserId: advertiser._id,
                fullName: advertiser.fullName,
                email: advertiser.email,
                whatsapp: advertiser.whatsapp,
                paymentStatus: advertiser.paymentStatus,
                paymentType: advertiser.paymentType,
                amountPaid: advertiser.amountPaid,
                balanceAmount: advertiser.balanceAmount,
            },
        });
    } catch (error) {
        console.error("Error fetching advertiser:", error);
        return res.json({
            success: false,
            message: error.message || "Error fetching registration"
        });
    }
};