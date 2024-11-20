import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "event-manager","inquiry-manager","hotel-manager","package-manager","campingitem-manager","feedback-manager","vehicle-manager"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
