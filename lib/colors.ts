/* Color constants for non-CSS contexts that cannot consume CSS custom
   properties: the Satori-rendered OG image (app/og-preview/route.tsx) and
   the transactional contact email (app/api/contact/route.ts). The OG values
   mirror the CSS tokens in app/styles/variables.css; the email palette is
   intentionally bespoke (its own gradient brand) and preserved verbatim. */

export const ogColors = {
  backgroundStart: '#07090f',
  backgroundMid: '#111623',
  backgroundEnd: '#1e1b4b',
  title: '#a5b4fc',
  body: '#cbd5e1',
};

export const emailColors = {
  gradientPrimary: '#667eea',
  gradientSecondary: '#764ba2',
  gradientAccent: '#f093fb',
  heading: '#2d3748',
  muted: '#718096',
  label: '#4a5568',
  fieldBackgroundStart: '#f7fafc',
  fieldBackgroundEnd: '#edf2f7',
  messageBackgroundStart: '#f8fafc',
  messageBackgroundEnd: '#e2e8f0',
  footer: '#a0aec0',
  shadowStrong: 'rgba(0,0,0,0.2)',
  shadowSoft: 'rgba(0,0,0,0.1)',
  ctaGlow: 'rgba(102, 126, 234, 0.3)',
};

/* Composite gradients reused across the email template, derived from the
   palette above so a single source drives the bespoke email brand. */
export const emailGradients = {
  brand: `linear-gradient(135deg, ${emailColors.gradientPrimary} 0%, ${emailColors.gradientSecondary} 100%)`,
  brandAccent: `linear-gradient(90deg, ${emailColors.gradientPrimary} 0%, ${emailColors.gradientSecondary} 50%, ${emailColors.gradientAccent} 100%)`,
  brandAccentCorner: `linear-gradient(135deg, ${emailColors.gradientPrimary} 0%, ${emailColors.gradientSecondary} 50%, ${emailColors.gradientAccent} 100%)`,
  avatarSecondary: `linear-gradient(135deg, ${emailColors.gradientSecondary} 0%, ${emailColors.gradientAccent} 100%)`,
  field: `linear-gradient(135deg, ${emailColors.fieldBackgroundStart} 0%, ${emailColors.fieldBackgroundEnd} 100%)`,
  message: `linear-gradient(135deg, ${emailColors.messageBackgroundStart} 0%, ${emailColors.messageBackgroundEnd} 100%)`,
};
