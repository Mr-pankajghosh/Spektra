import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  title: String,
  category: String,
  questions: [
    {
      question: String,
      options: [String],
      correct: Number
    }
  ],
  startTime: Date,
  endTime: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  winners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Contest", contestSchema);
