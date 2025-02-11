import * as dotenv from 'dotenv';
import * as jose from 'jose';
import * as crypto from 'crypto';

dotenv.config();

export class TokenService {
    private secretKey = process.env.NEXTAUTH_SECRET || "";

    async extractEmailToken(token: string): Promise<string | null> {
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

            if (!decodedToken || typeof decodedToken.email !== "string") {
                console.error("Token inválido ou sem email:", decodedToken);
                return null;
            }
            return decodedToken.email;

        } catch (error: any) {
            console.error("Erro na descriptografia do token:", error);
            return null;
        }
    }
}
