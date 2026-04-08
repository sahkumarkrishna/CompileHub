import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date },
    otpType: { type: String, enum: ['verification', 'reset'] },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    problemStats: {
      solved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
      attempted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

const User = mongoose.model('User', userSchema);

export default User;
