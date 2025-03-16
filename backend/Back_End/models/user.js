import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    homeAddress: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    college: { type: String, required: true },
    degree: { type: String, required: true },
    higherSecondaryEducation: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
