import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config()

export class TokenService {
    private secretKey = process.env.JWT_SECRET

    async extractEmailToken(token: string): Promise<string | null> {
        if(!this.secretKey){
            throw new Error('Secret key not found')
        }
        try {
            const decoded = jwt.verify(token, this.secretKey) as { email: string };
            return decoded.email

        } catch (error: any) {
            return null
        }
    }
}