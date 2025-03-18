import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Required fields for minimal registration
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Optional fields (can be filled in later)
  fullName: {
    type: String,
    required: false
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  homeAddress: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  zipCode: {
    type: String,
    required: false
  },
  college: {
    type: String,
    required: false
  },
  degree: {
    type: String,
    required: false
  },
  higherSecondaryEducation: {
    type: String,
    required: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

export default User;