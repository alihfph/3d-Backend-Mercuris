import express from "express";


import threeDModel from "./schema.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const newthreeD = new threeDModel(req.body);
    const { _id } = await newthreeD.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const total3D = await threeDModel.countDocuments(query.criteria);

    res.send(total3D);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const threeD = await threeDModel.findById(req.params.id);
    res.send(threeD);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const modified3D = await threeDModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modified3D) {
      res.send(modified3D);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const threeD = await threeDModel.findByIdAndDelete(req.params.id);
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
