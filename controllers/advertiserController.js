import advertiserModel from "../models/advertiserModel.js";
import transporter from "../config/nodemailer.js";

// Converts the advertiser data object into CSV text (header row + one data row)
const buildAdvertiserCsv = (advertiserData) => {
    const entries = Object.entries(advertiserData);

    const escapeCsvValue = (value) => {
        const formattedValue = Array.isArray(value) ? value.join('; ') : (value ?? '');
        const stringValue = String(formattedValue);
        // Wrap in quotes and escape existing quotes if the value has commas, quotes, or newlines
        if (/[",\n]/.test(stringValue)) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    const headerRow = entries
        .map(([key]) => key.replace(/([A-Z0-9])/g, ' $1').replace(/^./, str => str.toUpperCase()))
        .map(escapeCsvValue)
        .join(',');

    const dataRow = entries.map(([, value]) => escapeCsvValue(value)).join(',');

    return `${headerRow}\n${dataRow}`;
};

export const createAdvertiser = async (req, res) => {
    try {
        const advertiserData = req.body;
        
        const newAdvertiser = new advertiserModel(advertiserData);
        await newAdvertiser.save();

        const { fullName, email, companyName } = advertiserData;

        const csvContent = buildAdvertiserCsv(advertiserData);
        const safeFileName = (fullName || 'advertiser').replace(/[^a-z0-9]/gi, '_');

        const mailToAdmin = {
            from: process.env.SMTP_USER,
            to: 'kaviyaalordminds@gmail.com',
            subject: `New Advertiser Signup: ${fullName} from ${companyName}`,
            attachments: [ 
                {
                    filename: `advertiser_${safeFileName}.csv`,
                    content: csvContent
                }
            ],
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                <div style="background-color: #000000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2 style="color: #a4d64f; margin: 0; font-size: 24px;">New Advertiser Application</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
                    <p style="font-size: 16px; color: #333;">You have received a new advertiser application with the following details:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        ${Object.entries(advertiserData).map(([key, value]) => {
                            // Format key: "jobTitle" -> "Job Title", "section2Description" -> "Section 2 Description"
                            const formattedKey = key.replace(/([A-Z0-9])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            const formattedValue = Array.isArray(value) ? value.join(', ') : (value || 'N/A');
                            return `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555; vertical-align: top; width: 35%;">
                                    ${formattedKey}
                                </td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222; vertical-align: top;">
                                    ${formattedValue}
                                </td>
                            </tr>
                            `;
                        }).join('')}
                    </table>
                </div>
            </div>
            `
        };

        const mailToUser = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Thank you for your Advertiser Application - Mentaguide',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                <div style="background-color: #000000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h2 style="color: #a4d64f; margin: 0; font-size: 24px;">Application Received!</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear <strong>${fullName}</strong>,</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Thank you for applying to be an advertiser with Mentaguide. We have successfully received your application for <strong>${companyName || 'your company'}</strong>.</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Our team is currently reviewing your details and will get back to you shortly with the next steps.</p>
                    <div style="background-color: #f4f9ec; border: 1px solid #a4d64f; border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <p style="font-size: 16px; color: #202523; font-weight: bold; margin: 0 0 10px 0;">Event Details</p>
                        <p style="font-size: 15px; color: #333; margin: 4px 0;">📅 11TH AUGUST 2026 &nbsp;|&nbsp; 🕚 11:11 AM &nbsp;|&nbsp; 📍 MERLIS HOTEL, COIMBATORE</p>
                        <p style="margin: 15px 0 0 0;">
                            <a href="https://mentaguide.com/event" style="display: inline-block; background-color: #a4d64f; color: #202523; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 25px; text-transform: uppercase; letter-spacing: 0.5px;">View Event Page</a>
                        </p>
                    </div>
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-top: 30px;">Best Regards,<br/><span style="color: #a4d64f; font-weight: bold;">The Mentaguide Team</span></p>
                </div>
            </div>
            `
        };

        await transporter.sendMail(mailToAdmin);
        await transporter.sendMail(mailToUser);

        return res.json({
            success: true,
            message: "Advertiser signup form submitted successfully!"
        });
    } catch (error) {
        console.error("Error creating advertiser:", error);
        return res.json({
            success: false,
            message: error.message || "Error submitting form"
        });
    }
};