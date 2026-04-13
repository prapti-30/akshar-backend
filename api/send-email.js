const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, email, phone, location, services, message } = req.body;

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: "Missing email credentials" });
    }

    // ✅ Brevo SMTP Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // your Brevo email
        pass: process.env.EMAIL_PASS, // your Brevo SMTP key
      },
    });

    // Format services properly
    const servicesList = services && services.length
      ? services.join(", ")
      : "Not selected";

    // Send Email
    await transporter.sendMail({
      from: `"Akshar Website" <info@aksharelektrotekniks.com>`,
      to: "katkoriyaprapti771@gmail.com",
      replyTo: email,
      subject: "New Quote Request",
      html: `
        <h2>📩 New Quotation Request</h2>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Location:</strong> ${location || "N/A"}</p>
        <p><strong>Services:</strong> ${servicesList}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
      `,
    });

    return res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};
