import { User } from "./User";

export interface UserRepository {
    createUser(user: User): Promise<User>;
    getUserById(id: string): Promise<User | undefined>;
    updateUserFCMToken(userId: string, token: string): Promise<User | undefined>
}