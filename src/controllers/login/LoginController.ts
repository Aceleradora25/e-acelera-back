import { TokenService } from "../../services/TokenService";
import { Response, Request } from "express";
import { STATUS_CODE } from "../../utils/constants";

export class LoginController {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  async registerUser(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(STATUS_CODE.TOKEN_EXPIRED)
        .json({ message: "Expired or invalid token" });
    }

    try {
      const extractToken = await this.tokenService.extractToken(token);

      if (!extractToken) {
        return res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json({ message: "Error extracting token" });
      }

      const findUser = await this.tokenService.findUserByEmail(extractToken);

      if (findUser) {
        return res
          .status(STATUS_CODE.OK)
          .json({ message: "User already exists" });
      }

      const createdUser = await this.tokenService.registerUser(extractToken);

      if (!createdUser) {
        return res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json({ message: "Error registering user" });
      }

      return res
        .status(STATUS_CODE.OK)
        .json({ message: "User created successfully!" });
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error processing the created user" });
    }
  }
}
