import { StatusCodes } from "http-status-codes";
import { Resend, type ErrorResponse } from "resend";
import { GlobalConfigs } from "~/config/global-config";
import { ApplicationError } from "~/errors/ApplicationError";

const resend = new Resend(GlobalConfigs.resendConfig.apiKey);

type sendEmailData = {
  to: string;
  subject: string;
};

// error object from resend has a 'statusCode' property which is not registered in the ErrorResponse type.
interface ExtendedErrorResponse extends ErrorResponse {
  statusCode: number;
}

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
    const err = error as ExtendedErrorResponse;
    throw new ApplicationError(err.message, err.statusCode);
  }
}
