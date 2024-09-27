
import { injectable } from "tsyringe";
import { logger } from "../../../cross_cutting/logging";
import { IEmailService } from "../../../application/contracts/IEmailService";


@injectable()
export class SendGridEmailService implements IEmailService {

    // constructor(
    //     @inject("SendGridClient") private sendGridClient: SendGridClient
    // ) { }

    async sendEmail(email: string, subject: string, message: string): Promise<void> {
        logger.info(`Sending email to ${email} with subject: ${subject}`);

    }
}