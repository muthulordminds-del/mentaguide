import { google } from 'googleapis';

const SPREADSHEET_ID = '1PjV-Gr6ltdnNFrukUzDf8QwG3G1wTrUtWmKxs1OzW-c';
const SHEET_NAME = 'Mentaguide Event Registration'; // change this if your tab name is different

// Auth using service account credentials
const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const getFormattedTimestamp = () => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type) => parts.find((p) => p.type === type)?.value;
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}:${get('second')}`;
};

// Column T (index 19, 0-based) stores the Mongo advertiserId.
// It's kept out of the visible A:S range used elsewhere, so it acts
// as a hidden lookup key to find the right row to update later.
const ID_COLUMN = 'T';

const buildRow = (advertiserData) => [
  getFormattedTimestamp(),
  advertiserData.fullName || '',
  advertiserData.jobTitle || '',
  advertiserData.email || '',
  advertiserData.whatsapp || '',
  advertiserData.companyName || '',
  advertiserData.website || '',
  Array.isArray(advertiserData.industry) ? advertiserData.industry.join(', ') : (advertiserData.industry || ''),
  advertiserData.location || '',
  advertiserData.businessDescription || '',
  advertiserData.businessStage || '',
  Array.isArray(advertiserData.topicsOfInterest) ? advertiserData.topicsOfInterest.join(', ') : (advertiserData.topicsOfInterest || ''),
  advertiserData.primaryReason || '',
  advertiserData.additionalComments || '',
  // Payment columns (O-S)
  advertiserData.paymentType ? (advertiserData.paymentType === 'full' ? 'Full' : 'Partial') : '',
  advertiserData.amountPaid ? `Rs.${advertiserData.amountPaid}` : '',
  advertiserData.balanceAmount ? `Rs.${advertiserData.balanceAmount}` : 'Rs.0',
  advertiserData.paymentStatus || 'pending',
  advertiserData.razorpayPaymentId || '',
  // Hidden id column (T) used only to find this row again later
  (advertiserData._id ? advertiserData._id.toString() : (advertiserData.id || '')),
];

// Finds the sheet row number (1-indexed, matching actual sheet rows)
// whose hidden ID column matches this advertiser's Mongo _id.
// Returns null if no existing row is found (i.e. first time).
const findRowNumberById = async (sheets, advertiserId) => {
  const idRange = `${SHEET_NAME}!${ID_COLUMN}:${ID_COLUMN}`;
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: idRange,
  });

  const rows = data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === advertiserId) {
      return i + 1; // sheet rows are 1-indexed
    }
  }
  return null;
};

// Creates a brand-new row for this advertiser (called right after the
// registration form is submitted, before any payment attempt).
export const appendToSheet = async (advertiserData) => {
  try {
    console.log("appendToSheet function called");

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const row = buildRow(advertiserData);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:T`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    console.log("Google Sheet Row Added Successfully");
    console.log(response.data);

  } catch (error) {
    console.error("Google Sheet Error (append)");
    console.error(error.message);
    console.error(error.response?.data);
  }
};

// Updates the existing row for this advertiser (matched via the hidden
// ID column) with the latest data — used whenever payment status
// changes: pending -> paid / partial_paid / failed.
// If no existing row is found (e.g. sheet was cleared), it falls back
// to appending a new row so data is never silently lost.
export const updateSheetRow = async (advertiserData) => {
  try {
    const advertiserId = advertiserData._id ? advertiserData._id.toString() : advertiserData.id;
    if (!advertiserId) {
      console.error("updateSheetRow: missing advertiserId, cannot locate row");
      return;
    }

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const rowNumber = await findRowNumberById(sheets, advertiserId);
    const row = buildRow(advertiserData);

    if (rowNumber === null) {
      // No existing row found — append instead so nothing is lost
      console.log("updateSheetRow: no existing row found, appending new one");
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:T`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      });
      console.log("Google Sheet Row Added (fallback) Successfully");
      return;
    }

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowNumber}:T${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log(`Google Sheet Row ${rowNumber} Updated Successfully`);
    console.log(response.data);

  } catch (error) {
    console.error("Google Sheet Error (update)");
    console.error(error.message);
    console.error(error.response?.data);
  }
};