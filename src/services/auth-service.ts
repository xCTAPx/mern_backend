const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

type TokenType = "access" | "refresh";

const JwtSecretAccess = process.env.ACCESS_TOKEN_SECRET;
const JwtSecretRefresh = process.env.REFRESH_TOKEN_SECRET;

const createToken = (id: string, type: TokenType) => {
  const accessToken = type === "access";
  const secret = accessToken ? JwtSecretAccess : JwtSecretRefresh;

  return jwt.sign({ data: id }, secret, {
    expiresIn: accessToken ? "1h" : "30d",
  });
};

class AuthService {
  createTokens(req, res) {
    try {
      const { id } = req.body;

      const accessToken = createToken(id, "access");
      const refreshToken = createToken(id, "refresh");
      res.json({ accessToken, refreshToken });
    } catch (e) {
      console.error("ERROR: ", e.message);
      res.status(401).json({ message: "Something went wrong" });
    }
  }
}

module.exports = new AuthService();
