import * as dotenv from 'dotenv';
import * as jose from 'jose';
import * as crypto from 'crypto';
import { PrismaClient } from "@prisma/client"

dotenv.config();

const prisma = new PrismaClient()

interface UserToken {
    name: string,
    email: string,
    sub: string,
    id: string,
    provider: string,
    accessToken: string,
    iat: number,
    exp: number,
    jti: string
  }

export class TokenService {
    private secretKey = process.env.NEXTAUTH_SECRET || "";

    // CRIAR TIPO PARA TOKEN

    async extractToken(token: string): Promise<UserToken | null> {
        if (!this.secretKey) {
            throw new Error('Secret key not found');
        }
        try {
            const salt = Buffer.alloc(16);

            const key = await new Promise<Buffer>((resolve, reject) => {
                crypto.hkdf(
                    'sha256',
                    Buffer.from(this.secretKey, 'utf-8'),
                    salt,
                    Buffer.from('NextAuth.js Generated Encryption Key', 'utf-8'),
                    32,
                    (err, derivedKey) => {
                        if (err) reject(err);
                        else resolve(Buffer.from(derivedKey));
                    }
                );
            });

            const keyUint8Array = new Uint8Array(key);

            const { plaintext } = await jose.compactDecrypt(token, keyUint8Array);
            const decodedToken = JSON.parse(new TextDecoder().decode(plaintext));

            if (!decodedToken) {
                console.error("Token inválido");
                return null;
            }
            return decodedToken;

        } catch (error: any) {
            console.error("Erro na descriptografia do token:", error);
            return null;
        }
    }

    // async registerUser(token: string) {
    //     try {
    //         const email = await this.extractEmailToken(token)

    //         if(email){
    //             const user = prisma.user.findFirst({ where: {email, provider}})
    //         }
    //     } catch (error) {
            
    //     }
    // }
}
