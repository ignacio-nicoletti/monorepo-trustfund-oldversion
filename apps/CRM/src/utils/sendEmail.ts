"use server";

import transporterConfig from "./OTP/nodemailer.config";

interface Options {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(emailHtml: string, options: Options) {
  try {
    // Send the email using the transporter
    await transporterConfig.sendMail(options);
    return;
  } catch (error: any) {
    throw Error(error.message);
  }
}
