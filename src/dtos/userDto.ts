export class UserDto {
  email: string;
  nickname: string;
  id: string;
  isActivated: boolean;

  constructor(model: UserModelType) {
    this.email = model.email;
    this.nickname = model.nickname;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }
}
