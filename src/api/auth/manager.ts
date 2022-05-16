import mongoose from "mongoose"
import user, { userSchemaTypes } from "../../models/Users"
import { Manager } from "../common/manager"

export class AuthManager implements Manager{
  private user : mongoose.Model<userSchemaTypes>

  constructor(){
    this.user = user;
  }

  public findUser = async(usernameOrEmail : string) => {
    return this.user.findOne({$or: [
      {username: usernameOrEmail},
      {email: usernameOrEmail}
    ]}, {files : 0, password: 0})
  }

  public findUserbyId = async(id : string) => {
    return this.user.findById(id)
  }

  public saveUser = async(data : userSchemaTypes) => {
    return (await this.user.create(data)).save()
  }
}