const nodemailer = require('nodemailer');

async function enviarEmail(subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'destinatario@gmail.com',  // Troque pelo seu e-mail de destino
        subject: subject,
        text: message
    };

    await transporter.sendMail(mailOptions);
}

module.exports = enviarEmail;
