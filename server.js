require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const path = require("path");

app.use(express.static(path.join(__dirname, "../public"))); // FIX path if needed

// ✅ TRANSPORTER (using ENV)
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "a7b1ae001@smtp-brevo.com",
        pass: "xsmtpsib-0168c6fbd084ecb1581d3dd5a8e9252cc31d58b2e83733e4456739da35f7cd3e-e2uYKpIlAW9hnQw0"
    }
});

// ✅ ROUTE
app.post("/send-quotation", async (req, res) => {

    console.log("📩 Form Data:", req.body);

    const { name, phone, email, location, services, message } = req.body;

    // Convert services array to string
    const servicesList = Array.isArray(services)
        ? services.join(", ")
        : services || "N/A";

    // ✅ TEXT FORMAT (what you asked for)
    const textContent = `
New Quotation Request

Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}

Services: ${servicesList}

Message:
${message}
    `;

    try {
        await transporter.sendMail({
            from: `"Akshar Electrotekniks" <${process.env.EMAIL_USER}>`,
            to: "info@aksharelektrotekniks.com", // receiver
            replyTo: email,
            subject: "New Quotation Request",

            // ✅ BOTH FORMATS
            text: textContent,
            html: `
                <h2>New Quotation Request</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Location:</b> ${location}</p>
                <p><b>Services:</b> ${servicesList}</p>
                <p><b>Message:</b> ${message}</p>
            `
        });

        console.log("✅ Mail Sent");

        res.status(200).send("Success");

    } catch (error) {
        console.error("❌ Mail Error:", error);
        res.status(500).send("Error");
    }
});

// SERVER
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});