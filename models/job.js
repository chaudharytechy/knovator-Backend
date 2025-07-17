// /models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true },
  title: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  description: { type: String },
  postedAt: { type: Date },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
