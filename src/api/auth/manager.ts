import mongoose from "mongoose"
import user, { userSchemaTypes } from "../../models/Users"
import { Manager } from "../common/manager"

export class AuthManager implements Manager{
  private manager : mongoose.Model<userSchemaTypes>

  constructor(){
    this.manager = user
  }

  public findUser = async(usernameOrEmail : string) => {
    return this.manager.findOne({$or: [
      {username: usernameOrEmail},
      {email: usernameOrEmail}
    ]}, {files : 0, password: 0})
  }

  public saveUser = async(data : userSchemaTypes) => {
    return (await this.manager.create(data)).save()
  }
}