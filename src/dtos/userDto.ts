import { IUser } from "../types";

class UserDto {
  email: string;
  nickname: string;
  id: string;
  isActivated: boolean;

  constructor(model: IUser) {
    this.email = model.email;
    this.nickname = model.nickname;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }
}

module.exports = UserDto;
