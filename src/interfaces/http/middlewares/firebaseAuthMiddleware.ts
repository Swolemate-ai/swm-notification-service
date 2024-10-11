import { inject, injectable } from "tsyringe";
import { GetProfileUseCase } from "../../../application/profile/GetProfileUseCase";
import { logger } from "../../../cross_cutting/logging";


// Extend the Express Request type to include a user property
declare global {
    namespace Express {
      interface Request {
        subject:string;
        userProfile?: any // Replace 'any' with your User type
      }
    }
  }

@injectable()
export class FirebaseAuthMiddleware {
    constructor(@inject(GetProfileUseCase) private gerProfile:GetProfileUseCase) {
    }

    public authenticate = async (req: any, res: any, next: any): Promise<void> => {
        try {
            const userInfoHeader = req.get('X-Apigateway-Api-UserInfo');
            if(userInfoHeader) {
                const userInfo = JSON.parse(Buffer.from(userInfoHeader, 'base64').toString());
                req.subject = userInfo.sub;
                const userProfile = await this.gerProfile.execute(userInfoHeader);
                if (!userProfile) {
                    res.status(404).json({ error: 'User profile not found' });
                    return;
                }
                req.userProfile = userProfile;
            } else {
                res.status(401).json({ error: 'No user info provided' });
                return;
            }

            next();
        } catch (error) {
            logger.error(`${FirebaseAuthMiddleware.name}`);
            logger.error('Authentication error:', error);
        }
    }

}

// Export a factory function to create the middleware
export const createFirebaseAuthMiddleware = (container: any) => {
    const authMiddleware = container.resolve(FirebaseAuthMiddleware);
    return authMiddleware.authenticate;
  };