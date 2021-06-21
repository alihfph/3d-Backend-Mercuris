import mongoose from "mongoose"

const { Schema, model } = mongoose

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String

});

export default model("User", UserSchema)