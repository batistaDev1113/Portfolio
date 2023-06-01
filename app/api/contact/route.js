const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SENDGRID_API_KEY);

export const POST = async (req) => {
  const body = await req.json();

  console.log(body.full_name);

  const message = `
    FullName: ${body.full_name}\r\n
    Email: ${body.email}\r\n
    Message: ${body.textarea}\r\n
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
