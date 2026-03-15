import { SendMailClient } from "zeptomail";

const url = "api.zeptomail.in/v1.1/email/template";
const token = process.env.ZEPTO_MAIL_TOKEN!;

if (!token) {
  console.warn("ZEPTO_MAIL_TOKEN is missing. Emails will not be sent.");
}

const client = new SendMailClient({ url, token });

interface SendTemplateEmailParams {
  to: { email: string; name?: string }[];
  templateKey: string;
  mergeInfo?: Record<string, string | number>;
}

/**
 * Sends a transactional email using a ZeptoMail template.
 */
export async function sendTemplateEmail({
  to,
  templateKey,
  mergeInfo = {},
}: SendTemplateEmailParams) {
  const recipientList = to.map((t) => t.email).join(", ");
  
  if (!token) {
    console.error(`[ZeptoMail] Attempted to send email to ${recipientList} but ZEPTO_MAIL_TOKEN is missing.`);
    return { success: false, error: "Missing token" };
  }

  try {
    console.log(`[ZeptoMail] Sending template ${templateKey} to: ${recipientList}`);
    
    const response = await client.sendMailWithTemplate({
      template_key: templateKey,
      from: {
        address: process.env.ZEPTO_FROM_EMAIL!,
        name: process.env.ZEPTO_FROM_NAME!,
      },
      to: to.map((t) => ({
        email_address: {
          address: t.email,
          name: t.name || t.email.split("@")[0],
        },
      })),
      merge_info: Object.fromEntries(
        Object.entries(mergeInfo).map(([k, v]) => [k, String(v)])
      ),
    });

    console.log(`[ZeptoMail] Email sent successfully to ${recipientList}. Request ID: ${(response as { request_id?: string }).request_id || 'N/A'}`);
    return { success: true, data: response };
  } catch (error) {
    console.error(`[ZeptoMail] Critical failure sending email to ${recipientList}:`, error);
    return { success: false, error };
  }
}
