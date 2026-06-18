import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft'
  },
  createdBy: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
