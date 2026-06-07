import { resend } from "../config/resend";

export class EmailService {
  static async sendMail(
    to: string,
    subject: string,
    html: string
  ) {
    try {
      const result = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html,
      });

      console.log("Email enviado:", result);

      return result;
    } catch (error) {
      console.error("Error enviando email:", error);
      throw error;
    }
  }
}
