import { Resend } from "resend";

export const resend = new Resend(
  process.env.NEXT_PUBLIC_RESEND_API_KEY || "re_123",
);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "Kendrick from Miindy <kendrick@mail.miindy.com>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorEmail = async (email, token) => {
  await resend.emails.send({
    from: "Kendrick from Miindy <kendrick@mail.miindy.com>",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendVerificationEmail = async (email, token) => {
  const confirmationLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Kendrick from Miindy <kendrick@mail.miindy.com>",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>`,
  });
};
