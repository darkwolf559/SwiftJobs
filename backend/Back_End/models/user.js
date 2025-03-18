import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  homeAddress: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  zipCode: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  highSchool: {
    type: String,
    default: ''
  },
  higherSecondaryEducation: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Change export to use mongoose.model
export default mongoose.model('User', UserSchema);