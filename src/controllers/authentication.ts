const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const JwtSecret = process.env.TOKEN_SECRET;

class Authentication {
  create(req, res) {
    try {
      const createAccessToken = (id: string) =>
        jwt.sign({ data: id }, JwtSecret, { expiresIn: "1h" });

      const { id } = req.body;

      const accessToken = createAccessToken(id);
      res.json({ accessToken });
    } catch (e) {
      console.error("ERROR: ", e.message);
      res.status(401).json({ message: "Something went wrong" });
    }
  }
}

module.exports = new Authentication();
