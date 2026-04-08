import express from 'express';
import jwt from 'jsonwebtoken';
import Compile from '../models/Compile.js';
import User from '../models/User.js';

const router = express.Router();

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(401).json({ message: 'Unauthorized - no token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin) {
      req.isAdmin = true;
      req.id = decoded.userId;
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/profile', adminAuth, async (req, res) => {
  try {
    if (req.id === 'admin') {
      return res.json({
        success: true,
        user: {
          id: 'admin',
          name: process.env.ADMIN_NAME || 'Admin',
          email: process.env.ADMIN_EMAIL || 'admin@compilehub.com',
          profilePhoto: ''
        }
      });
    }

    const user = await User.findById(req.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto || ''
      }
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

router.put('/profile', adminAuth, async (req, res) => {
  try {
    const { name, email, profilePhoto } = req.body;

    if (req.id === 'admin') {
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: 'admin',
          name: name || process.env.ADMIN_NAME || 'Admin',
          email: email || process.env.ADMIN_EMAIL || 'admin@compilehub.com',
          profilePhoto: profilePhoto || ''
        }
      });
    }

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto || ''
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    
    const totalCodes = await Compile.countDocuments();
    const newCodesToday = await Compile.countDocuments({ createdAt: { $gte: today } });

    const statusBreakdown = await Compile.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const languageStats = await Compile.aggregate([
      { $match: { language: { $exists: true, $ne: null } } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const hourlyActivity = await Compile.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const successCount = statusBreakdown.find(s => s._id === 'success')?.count || 0;
    const successRate = totalCodes > 0 ? Math.round((successCount / totalCodes) * 100) : 0;

    const execTimeResult = await Compile.aggregate([
      { $match: { executionTime: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgTime: { $avg: '$executionTime' } } }
    ]);
    const avgExecutionTime = execTimeResult[0]?.avgTime || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        newUsersToday,
        totalCodes,
        newCodesToday,
        successRate,
        avgExecutionTime: Math.round(avgExecutionTime * 100) / 100
      },
      languageStats,
      hourlyActivity,
      statusBreakdown
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await Compile.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

router.post('/users/:id/unlock', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.lockUntil = undefined;
    user.failedAttempts = 0;
    await user.save();
    res.json({ success: true, message: 'User unlocked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unlock failed' });
  }
});

router.post('/users/unlock-by-email', adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.lockUntil = undefined;
    user.failedAttempts = 0;
    await user.save();
    res.json({ success: true, message: 'User unlocked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unlock failed' });
  }
});

router.get('/codes', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const language = req.query.language || '';
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problemTitle: { $regex: search, $options: 'i' } }
      ];
    }
    if (language) {
      query.language = language;
    }

    const total = await Compile.countDocuments(query);
    const codes = await Compile.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const codesWithUser = codes.map(code => ({
      _id: code._id,
      title: code.title,
      problemTitle: code.problemTitle,
      language: code.language,
      code: code.code,
      output: code.output,
      status: code.status,
      executionTime: code.executionTime,
      user: code.user ? {
        _id: code.user._id,
        name: code.user.name,
        email: code.user.email
      } : null,
      createdAt: code.createdAt,
      updatedAt: code.updatedAt
    }));

    res.json({
      success: true,
      codes: codesWithUser,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Codes error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch codes' });
  }
});

router.delete('/codes/:id', adminAuth, async (req, res) => {
  try {
    await Compile.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Code deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

router.get('/runs', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Compile.countDocuments();
    const runs = await Compile.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      runs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Runs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch runs' });
  }
});

router.get('/errors', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { status: 'error' };
    const total = await Compile.countDocuments(query);
    const errors = await Compile.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      errors,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Errors error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch errors' });
  }
});

router.get('/submissions', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const problemId = req.query.problemId || '';
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problemTitle: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }
    if (problemId) {
      query.problemId = problemId;
    }
    if (status) {
      query.status = status;
    }

    const total = await Compile.countDocuments(query);
    const submissions = await Compile.find(query)
      .populate('user', 'name email')
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const submissionsWithDetails = submissions.map(sub => ({
      _id: sub._id,
      title: sub.title,
      problemTitle: sub.problemTitle || sub.problemId?.title || 'Unknown',
      difficulty: sub.problemId?.difficulty || 'Easy',
      language: sub.language,
      status: sub.status,
      executionTime: sub.executionTime || '0',
      memoryUsed: sub.memoryUsed || '0',
      createdAt: sub.createdAt,
      user: sub.user ? {
        _id: sub.user._id,
        name: sub.user.name,
        email: sub.user.email
      } : null
    }));

    // Get unique user count per problem
    const userCounts = await Compile.aggregate([
      { $group: { _id: '$problemId', uniqueUsers: { $addToSet: '$user' } } },
      { $project: { count: { $size: '$uniqueUsers' } } }
    ]);

    res.json({
      success: true,
      submissions: submissionsWithDetails,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      userCounts
    });
  } catch (err) {
    console.error('Submissions error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
});

export default router;
