import Problem from '../models/Problem.js';
import mongoose from 'mongoose';

export const createProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    const savedProblem = await problem.save();
    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: savedProblem
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A problem with this slug already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const { difficulty, topic, company, search, page = 1, limit = 50 } = req.query;
    
    const query = { status: 'active' };
    
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topics = topic;
    if (company) query.companies = company;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [problems, total] = await Promise.all([
      Problem.find(query)
        .select('-testCases')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Problem.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: problems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProblems: total,
        hasMore: skip + problems.length < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProblemBySlug = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: problem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProblemStats = async (req, res) => {
  try {
    const [total, easy, medium, hard, premium, best] = await Promise.all([
      Problem.countDocuments({ status: 'active' }),
      Problem.countDocuments({ status: 'active', difficulty: 'Easy' }),
      Problem.countDocuments({ status: 'active', difficulty: 'Medium' }),
      Problem.countDocuments({ status: 'active', difficulty: 'Hard' }),
      Problem.countDocuments({ status: 'active', premium: true }),
      Problem.countDocuments({ status: 'active', difficulty: 'Best' })
    ]);

    // Get submissions with user details
    const Compile = (await import('../models/Compile.js')).default;
    const submissionStats = await Compile.aggregate([
      {
        $group: {
          _id: '$problemId',
          totalSubmissions: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' }
        }
      }
    ]);

    const totalSubmissions = submissionStats.reduce((sum, s) => sum + s.totalSubmissions, 0);
    const totalUniqueUsers = submissionStats.reduce((sum, s) => sum + (s.uniqueUsers?.length || 0), 0);

    const topics = await Problem.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$topics' },
      { $group: { _id: '$topics', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const companies = await Problem.aggregate([
      { $match: { status: 'active', companies: { $exists: true, $ne: [] } } },
      { $unwind: '$companies' },
      { $group: { _id: '$companies', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const submissions = await Problem.aggregate([
      { $group: { _id: null, total: { $sum: '$submissions' }, solved: { $sum: '$solvedCount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        easy,
        medium,
        hard,
        best,
        premium,
        topics,
        companies,
        submissions: submissions[0] || { total: 0, solved: 0 },
        totalSolved: submissions[0]?.solved || 0,
        totalSubmissions,
        totalUniqueUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRandomProblem = async (req, res) => {
  try {
    const { difficulty } = req.query;
    const query = { status: 'active' };
    if (difficulty) query.difficulty = difficulty;
    
    const count = await Problem.countDocuments(query);
    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne(query)
      .select('-testCases')
      .skip(random);
    
    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProblemStatsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem ID'
      });
    }

    const problem = await Problem.findById(id).select('solvedCount submissions acceptance');
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        solved: problem.solvedCount || 0,
        attempts: problem.submissions || 0,
        acceptance: problem.acceptance || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
