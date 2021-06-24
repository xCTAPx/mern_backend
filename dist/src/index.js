"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var port = process.env.PORT;
var app = express_1["default"]();
app.get("/", function (request, response) {
    response.send("Hello world!");
});
app.listen(port, function () { return console.log("Server has been started on port " + port); });
//# sourceMappingURL=index.js.map