import mongoose from "mongoose";

const { Schema, model } = mongoose;

const threeDSchema = new Schema({
  name: String,
  description: String,
  colorProperties: [String],
  svgFile: String

});

export default model("threeD", threeDSchema);
