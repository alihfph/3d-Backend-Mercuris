import express from "express";
import { JWTAuthMiddleware, authorize } from "../../auth/index.js"


import threeDModel from "./schema.js";

const threeDrouter = express.Router();

threeDrouter.post("/",  async (req, res, next) => {
  try {
    const newthreeD = new threeDModel(req.body);
    console.log(req.body)
    const { _id } = await newthreeD.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

threeDrouter.get("/",async (req, res, next) => {
  try {
    const total3D = await threeDModel.find();

    res.send(total3D);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

threeDrouter.get("/:id",JWTAuthMiddleware, async (req, res, next) => {
  try {
    const threeD = await threeDModel.findById(req.params.id);
    res.send(threeD);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

threeDrouter.put("/:id",JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.param.id)
    const modified3D = await threeDModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modified3D) {
      res.send(modified3D, "modified has been data");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

threeDrouter.delete("/:id",JWTAuthMiddleware, async (req, res, next) => {
  try {
    const threeD = await threeDModel.findByIdAndDelete(req.params.id);
    if (threeD) {
      res.send("ID Deleted");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default threeDrouter;
