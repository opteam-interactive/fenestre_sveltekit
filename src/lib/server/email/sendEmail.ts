import nodemailer, { type SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } from '$env/static/private';
import type { FormattedResponse, ResponseNoData, ResponseWithData } from '$lib/types/types';


export async function sendEmail(email: string, name:string, html: string, title:string): Promise<FormattedResponse<any>> {
   

    // create transporter
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    } as nodemailer.TransportOptions);


const senderEmail = process.env.EMAIL_USER ?? 'accueil@garagefenestre.fr';
const senderName = 'Garage Benoist Fenestre';
        //set up mail options
    const mailOptions: Mail.Options = {
        from: senderEmail,
        to: email,
        // cc: email, (uncomment this line if you want to send a copy to the sender)
        subject: `Message from ${senderName} : ${title}`,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions) ;
        return { success: true, data: info   };


    } catch (err) {
        console.error('Error sending email:', err);
        return { success: false, error : err?.toString() };
    }
}