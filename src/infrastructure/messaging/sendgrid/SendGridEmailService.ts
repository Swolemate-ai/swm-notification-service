
import { injectable } from "tsyringe";
import { logger } from "../../../cross_cutting/logging";
import { IEmailService } from "../../../application/contracts/IEmailService";
import sgMail from '@sendgrid/mail';

// import { sendTemplateEmail } from './emailService';


interface EmailData {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
  }

  interface TemplateEmailData {
    to: string;
    from: string;
    templateId: string;
    dynamicTemplateData: Record<string, unknown>;
  }
  

@injectable()
export class SendGridEmailService implements IEmailService {

    // constructor(
    //     @inject("SendGridClient") private sendGridClient: SendGridClient
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    // ) { }

    async sendEmail(email: string, subject: string, message: string): Promise<void> {
        logger.info(`Sending email to ${email} with subject: ${subject}`);
        try {
            // await sgMail.send(emailData);

            // await sgMail.send({
            //     to: 'recipient@example.com',
            //     from: 'sender@yourdomain.com', // Use the email address you verified with SendGrid
            //     subject: 'Test Email',
            //     text: 'This is a test email sent from Node.js and TypeScript',
            //     html: '<strong>This is a test email sent from Node.js and TypeScript</strong>',
            //   });
            console.log('Email sent successfully');
          } catch (error) {
            console.error('Error sending email:', error);
            throw error;
          }

    }

    async sendTemplateEmail(emailData: TemplateEmailData): Promise<void> {
        try {
          await sgMail.send({
            to: emailData.to,
            from: emailData.from,
            templateId: emailData.templateId,
            dynamicTemplateData: emailData.dynamicTemplateData,
          });
          console.log('Template email sent successfully');
        } catch (error) {
          console.error('Error sending template email:', error);
          throw error;
        }
      }
    
}