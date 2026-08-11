import { emailColors, emailGradients } from '../../../lib/colors';

export const POST = async (req: Request) => {
  try {
    // Check if Mailjet API keys are configured
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
      console.error('MAILJET_API_KEY or MAILJET_SECRET_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log('Contact form submission:', body);

    // Validate required fields
    if (!body.full_name || !body.email || !body.textarea) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
    </head>
    <body style="margin: 0; padding: 0; background: ${emailGradients.brand}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"> 
      <div style="max-width: 650px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="background: ${emailGradients.brand}; display: inline-block; padding: 20px 40px; border-radius: 50px; box-shadow: 0 10px 30px ${emailColors.shadowStrong};">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">
              📩 New Portfolio Message
            </h1>
          </div>
        </div>

        <!-- Main Content Card -->
        <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px ${emailColors.shadowSoft}; position: relative; overflow: hidden;">
          
          <!-- Decorative gradient bar -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: ${emailGradients.brandAccent};"></div>
          
          <!-- Message Header -->
          <div style="text-align: center; margin-bottom: 35px;">
            <h2 style="color: ${emailColors.heading}; margin: 0; font-size: 28px; font-weight: 700; background: ${emailGradients.brand}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              You have a new message!
            </h2>
            <p style="color: ${emailColors.muted}; margin: 10px 0 0 0; font-size: 16px;">
              Someone reached out through your portfolio contact form
            </p>
          </div>

          <!-- Contact Information -->
          <div style="margin-bottom: 35px;">
            <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 20px; background: ${emailGradients.field}; border-radius: 15px; border-left: 5px solid ${emailColors.gradientPrimary};">
              <div style="background: ${emailGradients.brand}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-size: 20px; font-weight: bold;">
                👤
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: ${emailColors.label}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">From</p>
                <p style="margin: 0; color: ${emailColors.heading}; font-size: 18px; font-weight: 600;">${body.full_name}</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 20px; background: ${emailGradients.field}; border-radius: 15px; border-left: 5px solid ${emailColors.gradientSecondary};">
              <div style="background: ${emailGradients.avatarSecondary}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-size: 20px; font-weight: bold;">
                📧
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: ${emailColors.label}; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                <p style="margin: 0; color: ${emailColors.heading}; font-size: 18px; font-weight: 600;">${body.email}</p>
              </div>
            </div>
          </div>

          <!-- Message Content -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: ${emailColors.heading}; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
              <span style="background: ${emailGradients.brand}; color: white; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 16px;">💬</span>
              Message
            </h3>
            <div style="background: ${emailGradients.message}; padding: 25px; border-radius: 15px; border: 2px solid ${emailColors.messageBackgroundEnd}; position: relative;">
              <div style="position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: ${emailGradients.brandAccentCorner}; border-radius: 15px; z-index: -1; opacity: 0.1;"></div>
              <p style="color: ${emailColors.heading}; margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${body.textarea}</p>
            </div>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; padding: 30px 0; border-top: 1px solid ${emailColors.messageBackgroundEnd};">
            <a href="mailto:${body.email}" style="display: inline-block; background: ${emailGradients.brand}; color: white; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px ${emailColors.ctaGlow}; transition: all 0.3s ease;">
              📨 Reply to ${body.full_name}
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid ${emailColors.messageBackgroundEnd};">
            <p style="color: ${emailColors.muted}; margin: 0; font-size: 14px;">
              This message was sent through your portfolio contact form<br>
              <span style="font-size: 12px; color: ${emailColors.footer};">Received on ${new Date().toLocaleDateString(
                'en-US',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}</span>
            </p>
          </div>
        </div>

        <!-- Bottom spacing -->
        <div style="height: 40px;"></div>
      </div>
    </body>
    </html>`;

    // Mailjet API configuration
    const mailjetData = {
      Messages: [
        {
          From: {
            Email: 'yuniorbatista1113@gmail.com',
            Name: 'Portfolio Contact Form',
          },
          To: [
            {
              Email: 'yuniorbatista1113@gmail.com',
              Name: 'Yunior Batista',
            },
          ],
          Subject: `Portfolio Contact: Message from ${body.full_name}`,
          TextPart: `New message from: ${body.full_name} (${body.email})\n\nMessage:\n${body.textarea}`,
          HTMLPart: htmlContent,
        },
      ],
    };

    // Send email using Mailjet API
    const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify(mailjetData),
    });

    if (!mailjetResponse.ok) {
      const errorData = await mailjetResponse.json();
      console.error('Mailjet API error:', errorData);
      throw new Error(`Mailjet API error: ${mailjetResponse.status}`);
    }

    const result = await mailjetResponse.json();
    console.log('Email sent successfully via Mailjet:', result);
    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);

    // More detailed error logging
    if (error?.response) {
      console.error('Mailjet API response:', error.response.body);
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        details: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
