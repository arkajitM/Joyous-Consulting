import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const { name, email, phone, service, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ ok: false, message: "Please fill in all required fields." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from:
        process.env.CONTACT_FROM ||
        `"Joyous Consultant" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || "info@joyousconsultant.com",
      replyTo: `${name} <${email}>`,
      subject: `[Joyous Consultant] ${subject}`,
      text:
        `New contact form submission:\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || "N/A"}\n` +
        `Service: ${service || "N/A"}\n\n` +
        `Message:\n${message}\n`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      ok: true,
      message: "Thank you for your message! We will contact you soon.",
    });
  } catch (err) {
    console.error("Email error", err);
    return res.status(500).json({
      ok: false,
      message: "There was a problem sending your message. Please try again.",
    });
  }
}
