import { T_Email_Body } from '@/types';
import nodemailer from 'nodemailer';

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS
} = process.env;

export default class Email {
  static #transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: !!Number(EMAIL_SECURE),
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
  
  static async send_verification_code(email: string, verification_code: string) {
    const body: T_Email_Body = {
      from: 'noreply@tripchronicles.world',
      to: email,
      subject: 'Account verification',
      html: `
      <div style="color: #000;width: 90%; padding: 0.5rem; padding-right: 0.7rem; font-family: sans-serif;">
        <section style="margin: 0 auto; width: 100%; max-width: 400px; background-color: #ddd; padding: 2rem 2rem 0.5rem; border-radius: 5px;">
          <p style="margin: 0; padding: 0; font-size: 1.3rem; font-weight: 600; text-align: center;">
            Verification Code
          </p>
          <p style="margin: 0.2rem 0 0; font-size: 2rem; font-weight: 600; text-align: center; padding: 0.5rem; background-color: #fff; letter-spacing: 1px;">
            ${verification_code}
          </p>
          <p style="text-align: center; font-size: 0.8rem; margin: 2rem 0 0; padding: 0;">
            The code is valid for 10 minutes
          </p>
        </section>
      </div>`
    };
    
    try {
      await this.#transporter.sendMail(body);
      return { success: true };
    } catch (error) {
      console.error('Error in Email_Sender -> send_verification_code: ' + error);
      return {
        success: false,
        error
      };
    }
  }

  static async send_generated_password(email: string, password: string) {
    const body: T_Email_Body = {
      from: 'noreply@tripchronicles.world',
      to: email,
      subject: 'Password recovery',
      html: `
      <div>
        <p>Your password is <b>${password}</b></p>
        <p>Customize this message</p>
      </div>`
    };
    
    try {
      await this.#transporter.sendMail(body);
      return { success: true };
    } catch (error) {
      console.error('Error in Email_Sender -> send_generated_password: ');
      return {
        success: false,
        error
      };
    }
  }
} 