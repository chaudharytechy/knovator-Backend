// /models/ImportLog.js
import mongoose from "mongoose";


const importLogSchema = new mongoose.Schema({
  fileName: { type: String },
  timestamp: { type: Date, default: Date.now },
  totalFetched: { type: Number },
  totalImported: { type: Number },
  newJobs: { type: Number },
  updatedJobs: { type: Number },
  failedJobs: [{ type: String }],
}, { timestamps: true });

const ImportLog = mongoose.model("ImportLog", importLogSchema);
export default ImportLog;
