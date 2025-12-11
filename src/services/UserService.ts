import prisma from "../../client.js";

export class UserService {
	async findUserByEmail(email: string) {
		try {
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) throw new Error("User not found.");
			return user;
		} catch (error) {
			throw new Error("Error fetching user from database.");
		}
	}
}
