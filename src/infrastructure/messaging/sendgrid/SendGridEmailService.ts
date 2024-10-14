
import { injectable } from "tsyringe";
import { logger } from "../../../cross_cutting/logging";
import { IEmailService } from "../../../application/contracts/IEmailService";
import sgMail from '@sendgrid/mail';
import { SendGridConfig } from "../../../cross_cutting/config";

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
    constructor(){
      sgMail.setApiKey(SendGridConfig.apiKey as string);
    }

    async sendEmail(email: string, subject: string, message: string): Promise<void> {
        logger.info(`Sending email to ${email} with subject: ${subject}`);
        try {

            await sgMail.send({
                to: email,
                from: SendGridConfig.verifiedSenderEmail as string, // Use the email address you verified with SendGrid
                subject: subject,
                text: message,
                html: '<strong>This is an email sent from Swolemate App</strong>',
              });
            logger.info('Email sent successfully');
          } catch (error) {
            logger.error('Error sending email:', error);
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