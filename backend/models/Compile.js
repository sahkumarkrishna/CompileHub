import mongoose from "mongoose";

const compileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    problemTitle: { type: String },
    title: { type: String, default: "Untitled" },
    language: { type: String, required: true },
    code: { type: String, required: true },
    input: { type: String },
    output: String,
    executionTime: String,
    memoryUsed: String,
    status: { type: String, enum: ['draft', 'success', 'failed'], default: 'draft' },
    results: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Compile = mongoose.model("Compile", compileSchema);

export default Compile;
