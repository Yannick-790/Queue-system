import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({

  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }

});



export async function sendVerificationEmail(
  email: string,
  token: string
) {

  const url =
    `${process.env.FRONTEND_URL}/verify-email/${token}`;


  await transporter.sendMail({

    from:
      `QueueFlow <${process.env.SMTP_EMAIL}>`,

    to: email,

    subject:
      "Verify your QueueFlow account",

    html: `

      <h2>Welcome to QueueFlow</h2>

      <p>
      Click the button below to verify your email.
      </p>


      <a href="${url}"

      style="
      background:#2563eb;
      color:white;
      padding:12px 20px;
      border-radius:8px;
      text-decoration:none;
      display:inline-block;
      ">

      Verify Email

      </a>


      <p>
      After verification you will setup your organization.
      </p>

    `

  });

}





export async function sendPasswordResetEmail(
  email: string,
  token: string
) {

  const url =
    `${process.env.FRONTEND_URL}/reset-password/${token}`;


  await transporter.sendMail({

    from:
      `QueueFlow <${process.env.SMTP_EMAIL}>`,

    to: email,

    subject:
      "Reset your QueueFlow password",

    html: `

      <h2>Password Reset</h2>

      <p>
      Click the link below to create a new password.
      </p>


      <a href="${url}"

      style="
      background:#dc2626;
      color:white;
      padding:12px 20px;
      border-radius:8px;
      text-decoration:none;
      display:inline-block;
      ">

      Reset Password

      </a>

    `

  });

}