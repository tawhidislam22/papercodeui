import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  async init() {
    if (this.transporter) return;

    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Use real SMTP credentials if provided
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        console.log('✅ Email service initialized (Real SMTP)');
      } else {
        console.warn('⚠️ No SMTP credentials found. Skipping email sending in production.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  async sendOTP(email: string, otp: string) {
    if (!this.transporter) await this.init();

    if (!this.transporter) {
      console.warn(`[Mock Email] Would have sent OTP ${otp} to ${email}`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: '"Paper Code" <noreply@papercode.com>',
        to: email,
        subject: 'Verify your Paper Code account',
        text: `Welcome to Paper Code! Your verification code is: ${otp}. This code expires in 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
            <h2>Welcome to Paper Code!</h2>
            <p>Please use the following OTP to verify your email address:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
          </div>
        `,
      });

      console.log('✉️  OTP Email sent successfully!');
      console.log('🔍 Preview URL: %s', nodemailer.getTestMessageUrl(info));
      
      return true;
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
