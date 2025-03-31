import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } from '$env/static/private';



export async function sendEmail(request: Request) {
    //Get info from request
    const { email, name, message } = await request.json();

    // create transporter
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    } as nodemailer.TransportOptions);

    //set up mail options
    const mailOptions: Mail.Options = {
        from: 'theo.harber@ethereal.email',
        to: 'theo.harber@ethereal.email',
        // cc: email, (uncomment this line if you want to send a copy to the sender)
        subject: `Message from ${name} (${email})`,
        text: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return Response.json({ message: 'Email sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }
}