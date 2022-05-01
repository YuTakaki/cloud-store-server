import mongoose from "mongoose"
import user, { userSchemaTypes } from "../../models/Users"

export class AuthManager{
  private manager : mongoose.Model<userSchemaTypes>

  constructor(){
    this.manager = user
  }

  public findUser = async(usernameOrEmail : string) => {
    return this.manager.findOne({$or: [{username : usernameOrEmail}]})
  }

  public saveUser = async(data : userSchemaTypes) => {
    return (await this.manager.create(data)).save()
  }
}