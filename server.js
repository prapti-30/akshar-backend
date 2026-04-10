require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();   // ✅ FIRST create app

// ✅ MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ STATIC FILES (optional)
app.use(express.static(path.join(__dirname, "public"))); // adjust if needed

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ✅ MAIL TRANSPORTER (USE ENV VARIABLES)
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ ROUTE
app.post("/send-quotation", async (req, res) => {

    console.log("📩 Form Data:", req.body);

    const { name, phone, email, location, services, message } = req.body;

    const servicesList = Array.isArray(services)
        ? services.join(", ")
        : services || "N/A";

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
            to: "info@aksharelektrotekniks.com",
            replyTo: email,
            subject: "New Quotation Request",
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
        res.status(500).send("Error sending mail");
    }
});

// ✅ SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
