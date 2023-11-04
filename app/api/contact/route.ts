const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SENDGRID_API_KEY);

export const POST = async (req: Request) => {
  const body = await req.json();

  console.log(body.full_name);

  const message = `<div style="font-size: 16px;">
  <h1 style="text-align: center;">New Message from Contact Form</h1>
    <span><strong>FullName:</strong> ${body.full_name}\r\n</span>
    <span><strong>Email:</strong> ${body.email}\r\n</span>
    <p><strong>Message:</strong> ${body.textarea}\r\n</p>
  </div>
  `;

  const data = {
    to: "yuniorbatista1113@gmail.com",
    from: "hello@yuniorbatista.com",
    subject: "New Message from Contact Form",
    text: message,
    html: message.replace(/\r\n/g, "<br>"),
  };

  await mail.send(data);
  return new Response(JSON.stringify({ message: "Email sent" }));
};
