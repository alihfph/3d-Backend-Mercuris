import express from "express"
import createError from "http-errors"

import { verifyJWT } from "./tools.js"
import UserModel from "../services/users/schema.js"


export const JWTAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = await verifyJWT(token)
    const user = await UserModel.findOne({
      _id: decoded._id,
    })

    if (!user) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (e) {
    console.log(e)
    const err = new Error("Please authenticate")
    err.httpStatusCode = 401
    next(err)
  }
}
  export const authorize =
  (allowedRoles) =>
  async (req, res, next) => {
    if (req.user) {
      if (allowedRoles.includes(req.user.role)) {
        next()
      } else {
        next(createError(403, "Not allowed!"))
      }
    } else {
      next(createError(401, "Please log in!"))
    }
  }