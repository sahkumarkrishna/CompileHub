import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date },
    otpType: { type: String, enum: ['verification', 'reset'] },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
