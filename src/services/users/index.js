import express from "express"
import UserModel from "./schema.js"
import q2m from "query-to-mongo"
import createError from "http-errors"
import dotenv from "dotenv"
import { authenticate } from "../../auth/tools.js"
import { JWTAuthMiddleware, authorize } from "../../auth/index.js"

const router = express.Router()

router.post("/register", async (req, res, next) => {
    try {
      const newUser = new UserModel(req.body)
      console.log(req.body)
      const { _id } = await newUser.save()
  
      res.status(201).send(_id)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log(req.body)
  
      const user = await UserModel.checkCredentials(email, password);
  
      if (user) {
        const accessToken = await authenticate(user);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: false
        });
        res.send(accessToken);
      } else {
        next(createError(400, "Wrong credentials"));
      }
    } catch (error) {
      console.log(error)
      next(error);
    }
  });
  
  router.get("/me",JWTAuthMiddleware, async (req, res, next) => {
    try {
      res.send(req.user)

    } catch (error) {
      console.log(error)
      next(error)
    }
  })
  

  
  router.put("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const updates = Object.keys(req.body);
      console.log(req.user)
      const updated = updates.forEach((update) => ((req.user )[update] = req.body[update]));
       console.log(updated)
     // req.user!.profilePic = req.file.path;
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:id", async (req, res, next) => {
    try {
      const threeD = await UserModel.findByIdAndDelete(req.params.id);
      if (threeD) {
        res.send("Deleted");
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  
  export default router;