// importing required modules
import mongoose from "mongoose";

// Creating ProblemSolved Schema
const ProblemSolvedSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

// Creating a Model from Schema
const ProblemSolved = mongoose.model("ProblemSolved", ProblemSolvedSchema);
export default ProblemSolved;
