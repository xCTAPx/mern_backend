const authService = require("../services/auth-service");

class Authentication {
  create(req, res) {
    authService.createTokens(req, res);
  }
}

module.exports = new Authentication();
