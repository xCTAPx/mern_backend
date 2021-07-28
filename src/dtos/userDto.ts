import { UserModel } from "../types";

class UserDto {
  email: string;
  nickname: string;
  id: string;
  isActivated: boolean;

  constructor(model: UserModel) {
    this.email = model.email;
    this.nickname = model.nickname;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }
}

export default UserDto;
