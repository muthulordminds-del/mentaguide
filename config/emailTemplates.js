export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Email Verify</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Verify your email
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          You are just one step away to verify your account for this email: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use below OTP to verify your account.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          This OTP is valid for 24 hours.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`

export const PASSWORD_RESET_TEMPLATE = `

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Forgot your password?
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          We received a password reset request for your account: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the OTP below to reset the password.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          The password reset otp is only valid for the next 15 minutes.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

// ---------------------------------------------------------------
// Sent immediately after /event-registration form submit (before
// any payment attempt). Registration is saved to MongoDB + Google
// Sheet with status "pending" at this point. This email lets the
// advertiser click through and pay whenever they're ready via
// {{paymentLink}}. Once they actually pay (success or failure),
// PAYMENT_FAILED_TEMPLATE / the payment-success mail in
// paymentController.js is sent, and the same Google Sheet row gets
// updated (not duplicated).
// ---------------------------------------------------------------
export const REGISTRATION_PENDING_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
    <div style="background-color: #000000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h2 style="color: #a4d64f; margin: 0; font-size: 24px;">Registration Received!</h2>
    </div>
    <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; color: #333;">Dear <strong>{{fullName}}</strong>,</p>
        <p style="font-size: 16px; color: #333;">Thank you for registering for <strong>Mentaguide Expand 360²</strong>. We've received your details successfully.</p>
        <div style="background-color: #fff8e6; border: 1px solid #eaa73b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="font-size: 15px; color: #b06a00; margin: 0; font-weight: bold;">⏳ Your registration is currently PENDING.</p>
            <p style="font-size: 14px; color: #555; margin: 8px 0 0 0;">To confirm your seat, please complete your payment using the button below.</p>
        </div>
        <div style="background-color: #f4f9ec; border: 1px solid #a4d64f; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #202523;">Click below to choose your payment plan (Full or Partial) and pay securely.</p>
            <a href="{{paymentLink}}" style="display: inline-block; background-color: #a4d64f; color: #202523; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 25px; text-transform: uppercase; letter-spacing: 0.5px;">Complete Payment</a>
        </div>
        <p style="font-size: 13px; color: #888;">If the button doesn't work, copy and paste this link into your browser:<br/>{{paymentLink}}</p>
        <p style="font-size: 16px; color: #333; margin-top: 30px;">Best Regards,<br/><span style="color: #a4d64f; font-weight: bold;">The Mentaguide Team</span></p>
    </div>
</div>
`

// ---------------------------------------------------------------
// Sent whenever a payment attempt fails — either reported directly
// by Razorpay checkout (recordPaymentFailure) or a signature
// mismatch during verification (verifyPayment). Includes the same
// payment link so the advertiser can simply retry.
// ---------------------------------------------------------------
export const PAYMENT_FAILED_TEMPLATE = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
    <div style="background-color: #000000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h2 style="color: #ff6b6b; margin: 0; font-size: 24px;">Payment Unsuccessful</h2>
    </div>
    <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; color: #333;">Dear <strong>{{fullName}}</strong>,</p>
        <p style="font-size: 16px; color: #333;">We noticed your recent payment attempt for <strong>Mentaguide Expand 360²</strong> did not go through.</p>
        <div style="background-color: #fdeeee; border: 1px solid #ff6b6b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="font-size: 14px; color: #b00; margin: 0;"><strong>Reason:</strong> {{reason}}</p>
        </div>
        <p style="font-size: 15px; color: #333;">No worries — your registration is still saved. You can try again anytime using the button below.</p>
        <div style="background-color: #f4f9ec; border: 1px solid #a4d64f; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <a href="{{paymentLink}}" style="display: inline-block; background-color: #a4d64f; color: #202523; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 25px; text-transform: uppercase; letter-spacing: 0.5px;">Retry Payment</a>
        </div>
        <p style="font-size: 13px; color: #888;">If the button doesn't work, copy and paste this link into your browser:<br/>{{paymentLink}}</p>
        <p style="font-size: 16px; color: #333; margin-top: 30px;">Best Regards,<br/><span style="color: #a4d64f; font-weight: bold;">The Mentaguide Team</span></p>
    </div>
</div>
`