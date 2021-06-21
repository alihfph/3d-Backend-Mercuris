import mongoose from "mongoose";

const { Schema, model } = mongoose;

const threeDSchema = new Schema({
  body: Number,
  size: Number,
  weight: Number,
  gender: String,
  verticleShape : [Number]

});

export default model("threeD", threeDSchema);
