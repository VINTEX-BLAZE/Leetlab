// importing required Modules
import mongoose from "mongoose";

// Creating Problem Schema
const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    difficulty: {}, // Enum
    tags: {
      type: [String],
      trim: true,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ondelete: "CASCADE",
      ref: "User",
      required: true,
    },
    examples: {
      type: JSON,
      trim: true,
      required: true,
    },
    constraints: {
      type: String,
      trim: true,
      required: true,
    },
    hints: {
      type: String,
      trim: true,
    },
    editorial: {
      type: String,
      trim: true,
    },
    testcases: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    codeSnippets: {
      type: mongoose.Schema.Types.Mixed,
    },
    referenceSolutions: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

// Creating a Model from Schema
const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
