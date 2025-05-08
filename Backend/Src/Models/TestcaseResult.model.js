// importing required modules
import mongoose from "mongoose";

// creating TestCaseResult Schema
const TestCaseResultSchema = new mongoose.Schema({

    submissionId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Submission",
        required: true,
    },
    testCase: {
        type : Number,
        required: true,
    },
    passed: {
        type : Boolean,
        required: true,
    },
    stdout: {
        type: String,
        trim : true,
    },
    expected: {
        type : String,
        trim: true,
        required : true
    },
    stderr: {
        type : String,
        trim : true
    },
    compileOutput: {
        type : String,
        trim : true
    },
    status: {
        type : String,
        trim: true,
        required : true
    },
    memory: {
        type : String,
        trim : true
    },
    tiem : {
        type : String,
        trim : true
    }


}, { timestamps: true });

// Creating a Model from Schema
const TestCaseResult = mongoose.model("TestCaseResult", TestCaseResultSchema);
export default TestCaseResult;