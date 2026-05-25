import {
  SendEmailCommand,
} from "@aws-sdk/client-ses";

import { sesClient } from "../config/awsSES";

export class EmailService {
  static async sendMail(to: string, subject: string, html: string) {
    try {
      const command = new SendEmailCommand({
        Source: process.env.SES_FROM_EMAIL!,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: html,
            },
          },
        },
      });

      const response = await sesClient.send(command);

      console.log("EMAIL ENVIADO:", response);

      return response;

    } catch (error) {
      console.error("ERROR SES:", error);
      throw error;
    }
  }
}