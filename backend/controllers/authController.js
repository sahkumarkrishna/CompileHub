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

    if (user.isLocked()) {
      const timeLeft = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({ 
        message: `Account is temporarily locked. Try again in ${timeLeft} minutes.` 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedAttempts += 1;
      
      if (user.failedAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
        user.failedAttempts = 0;
        await user.save();
        return res.status(403).json({ 
          message: 'Too many failed attempts. Account locked for 15 minutes.' 
        });
      }
      
      await user.save();
      const attemptsLeft = 5 - user.failedAttempts;
      return res.status(400).json({ 
        message: `Invalid credentials. ${attemptsLeft} attempts remaining.` 
      });
    }

    user.failedAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'compilehub_secret_key_2024',
      { expiresIn: '1d' }
    );

    console.log(`User ${user.name} logged in at ${new Date().toLocaleString()}`);

    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        profilePhoto: user.profilePhoto || ''
      },
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

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const adminName = process.env.ADMIN_NAME || 'Admin';

  const token = jwt.sign(
    { userId: 'admin', isAdmin: true },
    process.env.JWT_SECRET || 'compilehub_secret_key_2024',
    { expiresIn: '7d' }
  );

  console.log(`Admin logged in at ${new Date().toLocaleString()}`);

  res.json({
    token,
    isAdmin: true,
    user: {
      id: 'admin',
      name: adminName,
      email: process.env.ADMIN_EMAIL
    }
  });
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto || '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, profilePhoto } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    if (name !== undefined && name !== null && name !== '') user.name = name;
    if (email !== undefined && email !== null && email !== '') user.email = email;
    if (profilePhoto !== undefined && profilePhoto !== null && profilePhoto !== '') {
      user.profilePhoto = profilePhoto;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select('-password');

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto || ''
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error during profile update", success: false });
  }
};
