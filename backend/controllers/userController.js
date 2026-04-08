import User from '../models/User.js';

export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        solved: user.problemStats?.solved?.length || 0,
        attempted: user.problemStats?.attempted?.length || 0,
        easySolved: user.easySolved || 0,
        mediumSolved: user.mediumSolved || 0,
        hardSolved: user.hardSolved || 0,
        totalSolved: (user.easySolved || 0) + (user.mediumSolved || 0) + (user.hardSolved || 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const recordProblemAttempt = async (req, res) => {
  try {
    const { problemId, difficulty, solved } = req.body;
    const user = await User.findById(req.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const problemObjectId = problemId;
    
    if (!user.problemStats) {
      user.problemStats = { solved: [], attempted: [] };
    }
    
    const isAlreadySolved = user.problemStats.solved.includes(problemObjectId);
    const isAlreadyAttempted = user.problemStats.attempted.includes(problemObjectId);
    
    if (solved && !isAlreadySolved) {
      user.problemStats.solved.push(problemObjectId);
      
      if (difficulty === 'Easy') user.easySolved = (user.easySolved || 0) + 1;
      else if (difficulty === 'Medium') user.mediumSolved = (user.mediumSolved || 0) + 1;
      else if (difficulty === 'Hard') user.hardSolved = (user.hardSolved || 0) + 1;
    }
    
    if (!isAlreadyAttempted && !isAlreadySolved) {
      user.problemStats.attempted.push(problemObjectId);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Problem attempt recorded',
      data: {
        totalSolved: (user.easySolved || 0) + (user.mediumSolved || 0) + (user.hardSolved || 0),
        easySolved: user.easySolved,
        mediumSolved: user.mediumSolved,
        hardSolved: user.hardSolved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
