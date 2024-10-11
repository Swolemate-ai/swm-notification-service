
import { injectable } from "tsyringe";
import { Profile } from "../../application/profile/Profile";
import { ProfileService } from "../../application/profile/ProfileService";
import { EXTERNAL_SERVICES_CONFIG } from "../../cross_cutting/config/external-services";
import axios from "axios";

@injectable()
export class ProfileServiceImpl implements ProfileService {
  async getProfile(userInfoHeader:any): Promise<Profile> {

    try {
        const response = await axios.get(`${EXTERNAL_SERVICES_CONFIG.profileService.url}/user-profile`, {
          headers: {
            'X-ApiGateway-Api-UserInfo': userInfoHeader, // Add your header here
            // Add any other headers you need
          },
        });
        const data = response.data;
  
        return {
          id: data.id,
          userId: data.userId,
          displayName: data.displayName,
        };
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error("Failed to fetch profile");
      }
  }
}