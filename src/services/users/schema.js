import mongoose from "mongoose"
import bcrypt from "bcrypt"
import createError from "http-errors"


const { Schema, model } = mongoose

const UserSchema = new Schema({
  firstName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"] },

})



UserSchema.pre("save", async function (next) {
  const newUser = this

  const plainPW = newUser.password
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPW, 10)
  }
  next()
})

UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(createError(400, "Email already in use!"))
  } else {
    next(error)
  }
})

UserSchema.post("validate", function (error, doc, next) {
 if (error) {
    next(createError(400, error))
  } else {
   next()
  }
 })

UserSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email })
  console.log(user)

  if (user) {
    const isOk = await bcrypt.compare(password, user.password)
    console.log(isOk)
    if (isOk) return user
    else return null
  } else return null
}

export default model("User", UserSchema)
