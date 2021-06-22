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
      const { email, password } = req.body
      console.log(req.body)
      const user = await UserModel.checkCredentials(email, password)
      const token = await authenticate(user)
      res.send(token)
    } catch (error) {
      next(error)
      console.log(error)
    }
  })
  
  router.get("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
      res.send(req.user)
      console.log(req.user)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
  

  
  router.put("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
      console.log(req.body)
      
      // req.user.name = req.body.name
  
      const updates = Object.keys(req.body)
  
      updates.forEach(u => (req.user[u] = req.body[u]))
  
      await req.user.save()
  
      res.status(204, "sone").send("done")
    } catch (error) {
      next(error)
    }
  })
  
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