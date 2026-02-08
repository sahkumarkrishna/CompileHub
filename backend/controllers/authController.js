import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: true
    });
    await user.save();

    res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      otp,
      otpType: 'verification',
      otpExpires: { $gt: Date.now() }
    });
    
    if (!user)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpType = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`User ${user.name} logged in at ${new Date().toLocaleString()}`);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 600000;
    user.otpType = 'reset';
    await user.save();

    console.log('=== PASSWORD RESET OTP ===');
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('===========================');

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
      otpType: 'reset',
      otpExpires: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpType = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const updateProfile = async (req, res) => {
  try {
    const { password: newPassword, currentPassword } = req.body;
    const userId = req.id;

    if (!currentPassword)
      return res.status(400).json({ message: "Current password is required", success: false });

    if (!newPassword)
      return res.status(400).json({ message: "New password is required", success: false });

    const user = await User.findById(userId).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password", success: false });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Server error during password update", success: false });
  }
};
