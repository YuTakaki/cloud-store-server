import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName : {
    type: String,
    required: true
  },
  lastName : {
    type: String,
    required: true
  },
  username : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  bio : {
    type: String,
    required: true
  },
}, {timestamps: true})

const user = mongoose.model('user', userSchema);

export default user;