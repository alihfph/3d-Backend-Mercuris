import express from "express"
import createError from "http-errors"

import { verifyJWT } from "./tools.js"
import UserModel from "../services/users/schema.js"


export const JWTAuthMiddleware = async (req, res, next) => {
  try {
    console.log(req.cookies.accessToken, "this is token")
    if (req.cookies && req.cookies.accessToken) {
      const accessToken = req.cookies.accessToken;
       
      const decoded = await verifyJWT(accessToken);

      const user = await UserModel.findById(decoded._id);
         console.log(user, "this is user")
      if (user) {
        req.user = user;
        next()
      } else {
        throw new Error("User not found!");
      }
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};

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