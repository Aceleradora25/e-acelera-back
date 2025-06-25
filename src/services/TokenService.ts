import * as dotenv from "dotenv"
import * as jose from "jose"
import * as crypto from "crypto"
import { UserToken } from "../types/types"
import prisma from "../../client"

dotenv.config()

export class TokenService {
  private secretKey = process.env.NEXTAUTH_SECRET || ""

  async extractToken(token: string): Promise<UserToken | null> {
    if (!this.secretKey) {
      throw new Error("Secret key not found")
    }
    try {
      const salt = Buffer.alloc(16)

      const key = await new Promise<Buffer>((resolve, reject) => {
        crypto.hkdf(
          "sha256",
          Buffer.from(this.secretKey, "utf-8"),
          salt,
          Buffer.from("NextAuth.js Generated Encryption Key", "utf-8"),
          32,
          (err, derivedKey) => {
            if (err) reject(err)
            else resolve(Buffer.from(derivedKey))
          }
        )
      })

      const keyUint8Array = new Uint8Array(key)

      const { plaintext } = await jose.compactDecrypt(token, keyUint8Array)
      const decodedToken = JSON.parse(new TextDecoder().decode(plaintext))

      if (!decodedToken) {
        console.error("Invalid token")
        return null
      }

      return decodedToken
    } catch (error) {
      console.error("Error decrypting token:", error)
      return null
    }
  }

  async convertIatToDateTime(extractToken: UserToken){
    const brasiliaTimeZone = 10800
      const iat = extractToken.iat - brasiliaTimeZone

      const convertDate = (iat: number): Date => {
        return new Date(iat * 1000)
      }

      const dateTime = convertDate(iat)

      return dateTime
  }

  async registerUser(extractToken: UserToken) {
    try {
      const dateTime =  await this.convertIatToDateTime(extractToken)

      const createUser = await prisma.user.create({
        data: {
          email: extractToken.email,
          provider: extractToken.provider,
          loginDate: dateTime,
        },
      })

      return createUser
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async findUserByEmail(extractToken: UserToken)  {
    try {
      const loginDate =  await this.convertIatToDateTime(extractToken)

      const updateUser = await prisma.user.update({
        where: { email: extractToken.email },
        data: { loginDate, provider: extractToken.provider },
      })
      return updateUser
    } catch {
      return null
    }
  }
}
