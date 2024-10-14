
import { inject, injectable } from "tsyringe";
import { Profile } from "../../application/profile/Profile";
import { ProfileService } from "../../application/profile/ProfileService";
import { EXTERNAL_SERVICES_CONFIG } from "../../cross_cutting/config/external-services";
import axios from "axios";
import { RedisClient } from "../caching/redis/RedisClient";

@injectable()
export class ProfileServiceImpl implements ProfileService {
constructor(@inject(RedisClient) private redisClient: RedisClient) {}

  async getProfile(userInfoHeader:any): Promise<Profile> {

    try {
        const userInfo = JSON.parse(Buffer.from(userInfoHeader, 'base64').toString());

        // Check if the profile is cached
        const cachedProfile = await this.redisClient.get(`profile:${userInfo.sub}`);

        if (cachedProfile) {
          return JSON.parse(cachedProfile);
        }

        const response = await axios.get(`${EXTERNAL_SERVICES_CONFIG.profileService.url}/user-profile`, {
          headers: {
            'X-ApiGateway-Api-UserInfo': userInfoHeader, // Add your header here
            // Add any other headers you need
          },
        });
        const data = response.data;
        const profile = {
          id: data.id,
          postalCode: data.postalCode,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          city: data.city,
        };

        // Cache the profile
        await this.redisClient.set(`profile:${userInfo.sub}`, JSON.stringify(profile));

        return profile;
  
       
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error("Failed to fetch profile");
      }
  }
}