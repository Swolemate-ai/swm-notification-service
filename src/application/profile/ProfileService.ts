import { Profile } from "./Profile";

export interface ProfileService {
    getProfile(userInfoHeader:any): Promise<Profile>;
    }
    