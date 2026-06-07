import { Resend } from "resend";
import { config } from "./environment";

export const resend = new Resend(
  config.resendApiKey
);