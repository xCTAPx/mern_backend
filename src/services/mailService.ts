import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MailService {
  transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationLink(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Activation account",
      html: `
        <h3>Account Activation Link</h3>
        <p>For activation your account follow the lick below:</p>
        <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>
      `,
    });
  }

  async sendResetPasswordLink(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Restoring password",
      html: `
        <h3>Restore your password</h3>
        <p>For reset your password and creating a new one follow the lick below:</p>
        <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>
      `,
    });
  }
}

export const mailService = new MailService();
