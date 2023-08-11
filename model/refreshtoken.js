import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: { type: String, unique: true },
});
export default mongoose.model("Token", tokenSchema);
