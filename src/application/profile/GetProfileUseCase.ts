
import { inject, injectable } from "tsyringe";
import { ProfileService } from "./ProfileService";
import { Profile } from "./Profile";

@injectable()
export class GetProfileUseCase{
  constructor(
    @inject("ProfileService")
    private profileService: ProfileService
  ) {}

  async execute(userInfoHeader:any): Promise<Profile> {
    const profile = await this.profileService.getProfile(userInfoHeader);

    if (!profile) {
      throw new ProfileNotFound("Profile not found");
    }

    return profile;
  }
}



export class ProfileNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileNotFound";
  }
}