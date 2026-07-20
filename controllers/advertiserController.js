import advertiserModel from "../models/advertiserModel.js";
import { appendToSheet } from "../config/googleSheets.js";

// ---------------------------------------------------------------
// STEP 0: Save the event-registration form.
// Saved to MongoDB AND to the Google Sheet immediately (status:
// "pending"), before payment is even attempted. No email is sent
// here — email is still sent only once, after payment succeeds
// (see paymentController.js -> verifyPayment). The sheet row
// created here is later UPDATED (not duplicated) as the payment
// status changes to paid / partial_paid / failed.
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