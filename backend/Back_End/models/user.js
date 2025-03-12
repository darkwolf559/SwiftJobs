import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    homeAddress: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    college: { type: String, required: true },
    degree: { type: String, required: true },
    higherSecondaryEducation: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
