const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

export const forgotPasswordEmailTemplate = ({ name, resetPasswordUrl }) => ({
  subject: "Reset your password",
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2>Password reset request</h2>
      <p>Hello ${escapeHtml(name || "there")},</p>
      <p>We received a request to reset your password. Use the button below to choose a new one. This link expires in 10 minutes.</p>
      <p>
        <a href="${escapeHtml(resetPasswordUrl)}"
           style="display: inline-block; padding: 12px 20px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 4px;">
          Reset password
        </a>
      </p>
      <p>If you did not request a password reset, you can ignore this email.</p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p>${escapeHtml(resetPasswordUrl)}</p>
    </div>
  `,
});
