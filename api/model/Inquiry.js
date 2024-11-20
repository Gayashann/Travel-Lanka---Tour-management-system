import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  issueType: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
  },
  contactMethod: {
    type: String,
  },
  consent: {
    type: Boolean,
  },
  read: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
  },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;

//json dummy data
// {
//   "name": "Isuru",
//   "email": "isuru@gmail.com",
//   "contactNumber": "1234567890",
//   "issueType": "Technical",
//   "priority": "High",
//   "description": "I am facing issues with my account",
//   "attachment": "https://www.google.com",
//   "contactMethod": "Email",
//   "consent": true
// }
