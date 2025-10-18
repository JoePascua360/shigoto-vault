import { StatusCodes } from "http-status-codes";
import { Resend } from "resend";
import { GlobalConfigs } from "~/config/global-config";
import { ApplicationError } from "~/errors/ApplicationError";

const resend = new Resend(GlobalConfigs.resendConfig.apiKey);

type sendEmailData = {
  to: string;
  subject: string;
};

export async function sendEmail(
  emailConfig: sendEmailData,
  verificationUrl: string
) {
  const { error } = await resend.emails.send({
    ...emailConfig,
    from: `Shigoto Vault <${GlobalConfigs.resendConfig.referenceEmail}>`,
    html: `
    Verify Your Email using this link:

    ${verificationUrl}
    `,
  });

  if (error) {
    throw new ApplicationError(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
