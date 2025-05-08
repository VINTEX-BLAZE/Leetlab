// importing required Modules
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      ondelete: "CASCADE",
      required: true,
    },
    problemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      ondelete: "CASCADE",
      required: true,
    },
    sourceCode: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    stdin: {
      type: String,
    },
    stdout: {
      type: String,
    },
    stderr: {
      type: String,
    },
    compileOutput: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    memory: {
      type: String,
    },
    time: {
      type: String,
    },
    testCases: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "TestCaseResult",
    }
  },
  { timestamps: true },
);

// Creating a Model from Schema
const Submission = mongoose.model("Submission", SubmissionSchema);
export default Submission;
