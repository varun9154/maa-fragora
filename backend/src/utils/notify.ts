import nodemailer from "nodemailer";
// note: read SMTP/Twilio config from process.env so env.ts doesn't need to include them

export async function sendRegistrationNotifications(user: {
  id: number | string;
  name: string;
  email?: string | null;
  phone?: string | null;
}) {
  const { name, email, phone } = user;

  // Send email if SMTP credentials present
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailHost = process.env.EMAIL_HOST || process.env.SMTP_HOST;
    const emailPort = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport(
        emailHost
          ? {
              host: emailHost,
              port: emailPort,
              secure: emailPort === 465,
              auth: {
                user: emailUser,
                pass: emailPass,
              },
            }
          : {
              service: "gmail",
              auth: {
                user: emailUser,
                pass: emailPass,
              },
            }
      );

      const mail = await transporter.sendMail({
        from: emailUser,
        to: email || undefined,
        subject: "Welcome to MAA Fragora - Registration Successful",
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for registering with <strong>MAA Fragora</strong>! Your account has been created successfully.</p>
          <p>We're excited to have you — explore our collection and find your signature scent.</p>
          <p>Best regards,<br/>MAA Fragora Team</p>
        `,
      });

      console.info("Registration email sent:", mail.messageId);
    }
  } catch (err) {
    console.warn("Failed to send registration email:", err);
  }

  // Send SMS if Twilio configured
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;

    if (sid && token && from && phone) {
      try {
        // Dynamically require to avoid hard dependency if not installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const twilio = require("twilio");

        const client = twilio(sid, token);

        const msg = await client.messages.create({
          body: `Hi ${name}, your MAA Fragora account was created successfully. Welcome!`,
          from,
          to: phone,
        });

        console.info("Registration SMS sent:", msg.sid);
      } catch (err: any) {
        console.warn("Twilio send failed (install twilio and set env vars):", err?.message || err);
      }
    }
  } catch (err) {
    console.warn("Failed to send registration SMS:", err);
  }
}

export default sendRegistrationNotifications;
