import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

type EmailString = string;
type RecipientObject = {
  email: string;
  name?: string;
};
type Recipients =
  | EmailString
  | EmailString[]
  | RecipientObject
  | RecipientObject[];

interface BrevoApiResponse {
  messageId?: string;
  code?: string;
  body?: unknown;
  [key: string]: unknown;
}

interface SendEmailOptions {
  to: Recipients;
  subject: string;
  htmlContent: string;
}

interface BrevoError extends Error {
  response?: {
    body?: unknown;
  };
}

/**
 * Sends an email to one or multiple recipients
 * @param {SendEmailOptions} options - Email options
 * @returns {Promise<BrevoApiResponse>} - Promise resolving to the API response
 */
async function sendEmail({
  to,
  subject,
  htmlContent,
}: SendEmailOptions): Promise<BrevoApiResponse> {
  const apiInstance = new TransactionalEmailsApi();
  const apiKey = process.env.BREVO_API_KEY as string;
  const emailSenderName = process.env.DEFAULT_SENDER_NAME as string;
  const senderEmail = process.env.DEFAULT_SENDER_EMAIL as string;

  let recipients: RecipientObject[] = [];

  if (typeof to === "string") {
    recipients = [{ email: to }];
  } else if (Array.isArray(to)) {
    if (to.length === 0) {
      throw new Error("Recipients list cannot be empty");
    }
    if (typeof to[0] === "string") {
      recipients = (to as string[]).map((email) => ({ email }));
    } else {
      recipients = to as RecipientObject[];
    }
  } else if (to && "email" in to) {
    recipients = [to as RecipientObject];
  } else {
    throw new Error("Invalid recipient format");
  }

  const mailOptions = new SendSmtpEmail();
  mailOptions.sender = { name: emailSenderName, email: senderEmail };
  mailOptions.replyTo = { email: senderEmail, name: emailSenderName };
  mailOptions.to = recipients;
  mailOptions.htmlContent = htmlContent;
  mailOptions.subject = subject;

  try {
    return (await apiInstance.sendTransacEmail(mailOptions, {
      headers: { "api-key": apiKey },
    })) as BrevoApiResponse;
  } catch (error) {
    const brevoError = error as BrevoError;
    console.error("Failed to send email:", {
      recipients: recipients.map((r) => r.email).join(", "),
      subject,
      error: brevoError.response?.body || brevoError.message || String(error),
    });
    throw error;
  }
}

export default sendEmail;
