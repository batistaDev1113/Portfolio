export const POST = async (req: Request) => {
  try {
    // Check if Mailjet API keys are configured
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
      console.error("MAILJET_API_KEY or MAILJET_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500 },
      );
    }

    const body = await req.json();
    console.log("Contact form submission:", body);

    // Validate required fields
    if (!body.full_name || !body.email || !body.textarea) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">New Message from Portfolio Contact Form</h2>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <p><strong>From:</strong> ${body.full_name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin-top: 10px;">
          ${body.textarea.replace(/\n/g, "<br>")}
        </div>
      </div>
    </div>`;

    // Mailjet API configuration
    const mailjetData = {
      Messages: [
        {
          From: {
            Email: "yuniorbatista1113@gmail.com",
            Name: "Portfolio Contact Form",
          },
          To: [
            {
              Email: "yuniorbatista1113@gmail.com",
              Name: "Yunior Batista",
            },
          ],
          Subject: `Portfolio Contact: Message from ${body.full_name}`,
          TextPart: `New message from: ${body.full_name} (${body.email})\n\nMessage:\n${body.textarea}`,
          HTMLPart: htmlContent,
        },
      ],
    };

    // Send email using Mailjet API
    const mailjetResponse = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`).toString("base64")}`,
      },
      body: JSON.stringify(mailjetData),
    });

    if (!mailjetResponse.ok) {
      const errorData = await mailjetResponse.json();
      console.error("Mailjet API error:", errorData);
      throw new Error(`Mailjet API error: ${mailjetResponse.status}`);
    }

    const result = await mailjetResponse.json();
    console.log("Email sent successfully via Mailjet:", result);
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Contact form error:", error);

    // More detailed error logging
    if (error?.response) {
      console.error("Mailjet API response:", error.response.body);
    }

    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error?.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
