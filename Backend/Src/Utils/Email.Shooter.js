import nodemailer from "nodemailer";
import Mailgen from "mailgen";

async function semdMail(Options) {
  const mailGenerator = new Mailgen({
    theme: "neopolitan",
    product: {
      // Appears in header & footer of e-mails
      name: "LeetLab",
      link: "https://mailgen.js/",
      // Optional product logo
      // logo: 'https://mailgen.js/img/logo.png'
      copyright: `Copyright © ${new Date().getFullYear()} LeetLab. All rights reserved.`,
    },
  });

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(Options.MailgenContent);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(Options.MailgenContent);

  // configurring nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  // Creating the Options for Transporter
  const TransportOptions = {
    from: process.env.MAILTRAP_SMTP_SENDER, // sender address
    to: Options.email, // list of receivers
    subject: Options.subject, // Subject line
    text: emailText, // plain text body
    html: emailBody, // html body
  };

  await transporter
    .sendMail(TransportOptions)
    .catch((error) => console.error("Failed to Send Email", error));
  console.log("Email Sent Successfully");
}

const EmailVerificationMailgenContent = (username, VerificationURL) => {
  return {
    body: {
      greeting: "Hi,",
      name: username,
      intro: "Welcome to LeetLab! Let's Smash some LeetLab Problems!",
      action: {
        instructions: "To get started with LeetLab, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account ->",
          link: VerificationURL,
        }
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
      signature: "Yours truly, LeetLab Team",
    }
 }
};

export { semdMail, EmailVerificationMailgenContent };
