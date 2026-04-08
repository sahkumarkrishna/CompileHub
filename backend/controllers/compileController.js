import Compile from "../models/Compile.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { 
  runJavaScript, runPython, runC_CPP, runJava,
  runRuby, runGo, runRust, runSwift, runKotlin, runScala,
  runPHP, runTypeScript, runCSharp, runBash, runPerl,
  runR, runLua, runPowerShell, runElixir, runHaskell,
  runJulia, runDart
} from "../utils/jsExecutor.js";

const getUserIdFromToken = (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

function analyzeComplexity(code, language) {
  let bestCase = "O(1)";
  let averageCase = "O(1)";
  let worstCase = "O(1)";
  let spaceComplexity = "O(1)";

  const forLoops = (code.match(/\bfor\s*\(/gi) || []).length;
  const whileLoops = (code.match(/\bwhile\s*\(/gi) || []).length;
  const doWhileLoops = (code.match(/\bdo\s*\{/gi) || []).length;
  const totalLoops = forLoops + whileLoops + doWhileLoops;
  
  const listComp = (code.match(/\[.*\s+for\s+.*\s+in.*\]/gi) || []).length;
  
  const higherOrderFuncs = (code.match(/\.(map|filter|reduce|forEach)\s*\(/gi) || []).length;
  
  const forNested = (code.match(/for\s*\([\s\S]*?for\s*\(/gi) || []).length;
  const whileNested = (code.match(/while\s*\([\s\S]*?while\s*\(/gi) || []).length;
  const nestedLoops = forNested + whileNested;
  
  const recursionJS = (code.match(/function\s+(\w+)\s*\([\s\S]*?\1\s*\(/gi) || []).length;
  const recursionPython = (code.match(/def\s+(\w+)\s*\([\s\S]*?\1\s*\(/gi) || []).length;
  const recursion = recursionJS + recursionPython;
  
  const arrayCreation = (code.match(/new\s+Array\s*\(|ArrayList|vector\s*</gi) || []).length;
  const arrayLiteral = (code.match(/\[\s*[\d\w,\s]+\s*\]/gi) || []).length;
  const stacks = (code.match(/stack\s*\(|Stack\s*<|push\s*\(/gi) || []).length;
  const queues = (code.match(/queue\s*\(|Queue\s*<|dequeue\s*\(/gi) || []).length;
  const dictionaries = (code.match(/new\s+Map|new\s+Set|new\s+Object|HashMap|HashSet/gi) || []).length;
  
  const sorting = (code.match(/\.sort\s*\(|sorted\(|qsort|mergesort|bubblesort|selectionsort|insertionsort/gi) || []).length;
  
  const binarySearch = (code.match(/binary\s*search|bsearch|search.*half/gi) || []).length;
  
  const dp = (code.match(/\bdp\b|memo\(|tabulation|bottom-up|top-down/gi) || []).length;
  
  const graphAlgo = (code.match(/bfs|dfs|dijkstra|bellman|floyd|prim|kruskal/gi) || []).length;
  
  const treeOps = (code.match(/bst|tree|root|node|leaf|insert.*tree|search.*tree/gi) || []).length;

  if (binarySearch > 0) {
    bestCase = "O(1)";
    averageCase = "O(log n)";
    worstCase = "O(log n)";
  } else if (sorting > 0 && code.includes("quick")) {
    bestCase = "O(n log n)";
    averageCase = "O(n log n)";
    worstCase = "O(n²)";
  } else if (sorting > 0) {
    bestCase = "O(n log n)";
    averageCase = "O(n log n)";
    worstCase = "O(n²)";
  } else if (dp > 0) {
    bestCase = "O(n)";
    averageCase = "O(n)";
    worstCase = "O(n²)";
  } else if (graphAlgo > 0) {
    bestCase = "O(V + E)";
    averageCase = "O(V + E)";
    worstCase = "O(V + E)";
  } else if (nestedLoops > 0) {
    bestCase = "O(n)";
    averageCase = "O(n²)";
    worstCase = "O(n²)";
  } else if (totalLoops > 0 || listComp > 0 || higherOrderFuncs > 0) {
    bestCase = "O(n)";
    averageCase = "O(n)";
    worstCase = "O(n)";
  } else if (recursion > 0) {
    bestCase = "O(log n)";
    averageCase = "O(n)";
    worstCase = "O(n)";
  }

  if (recursion > 0) {
    spaceComplexity = "O(n)";
  }
  if (dp > 0) {
    spaceComplexity = "O(n)";
  }
  if (arrayCreation > 0 || arrayLiteral > 0 || stacks > 0 || queues > 0 || dictionaries > 0 || treeOps > 0) {
    spaceComplexity = "O(n)";
  }
  if (nestedLoops > 0) {
    spaceComplexity = "O(n²)";
  }
  if (graphAlgo > 0) {
    spaceComplexity = "O(V + E)";
  }
  if (listComp > 0 || higherOrderFuncs > 0) {
    spaceComplexity = "O(n)";
  }
  if (sorting > 0) {
    if (code.includes("merge") || code.includes("quick")) {
      spaceComplexity = "O(n)";
    } else {
      spaceComplexity = "O(1)";
    }
  }

  return { bestCase, averageCase, worstCase, spaceComplexity };
}

const languageExecutors = {
  javascript: runJavaScript,
  python: runPython,
  python3: runPython,
  c: (code, input) => runC_CPP(code, "c", input),
  cpp: (code, input) => runC_CPP(code, "cpp", input),
  java: runJava,
  ruby: runRuby,
  go: runGo,
  rust: runRust,
  swift: runSwift,
  kotlin: runKotlin,
  scala: runScala,
  php: runPHP,
  typescript: runTypeScript,
  csharp: runCSharp,
  bash: runBash,
  perl: runPerl,
  r: runR,
  lua: runLua,
  powershell: runPowerShell,
  elixir: runElixir,
  haskell: runHaskell,
  julia: runJulia,
  dart: runDart,
};

const SUPPORTED_LANGUAGES = Object.keys(languageExecutors);

export const compileCode = async (req, res) => {
  const { language, code, input } = req.body;

  console.log('Compile request received:', { language, codeLength: code?.length, input });

  if (!language || !code) {
    return res.status(400).json({ success: false, error: "Missing language or code" });
  }

  try {
    const userId = getUserIdFromToken(req);
    const normalizedLang = language.toLowerCase();
    const executor = languageExecutors[normalizedLang];
    
    console.log('Looking for executor for:', normalizedLang);
    console.log('Available executors:', Object.keys(languageExecutors));
    
    if (!executor) {
      const supportedList = SUPPORTED_LANGUAGES.join(', ');
      return res.status(400).json({ 
        success: false, 
        error: `Unsupported language: "${language}". Supported languages: ${supportedList}` 
      });
    }

    console.log('Found executor, executing...');
    
    let execRes;
    try {
      execRes = await executor(code, input || "");
    } catch (execError) {
      console.error('Executor error:', execError);
      let errorMessage = execError.toString();
      if (errorMessage.includes('Network error') || errorMessage.includes('ECONNREFUSED')) {
        errorMessage = "Code execution service is temporarily unavailable. Please try again later.";
      }
      return res.status(400).json({ success: false, error: errorMessage });
    }
    
    if (!execRes || !execRes.stdout) {
      return res.status(400).json({ success: false, error: "No output generated. Check your code." });
    }
    
    const { bestCase, averageCase, worstCase, spaceComplexity } = analyzeComplexity(code, language);

    const compileData = {
      language,
      code,
      input,
      output: execRes.stdout,
      executionTime: execRes.executionTime,
      memoryUsed: execRes.memoryUsed,
    };

    if (req.body.title) {
      compileData.title = req.body.title;
    } else {
      compileData.title = `${language} - ${new Date().toLocaleString()}`;
    }

    let compiled;
    if (userId) {
      compileData.user = userId;
      compiled = await Compile.create(compileData);
    } else {
      compiled = { output: compileData.output, executionTime: compileData.executionTime, memoryUsed: compileData.memoryUsed };
    }

    res.json({
      success: true,
      output: compiled.output,
      executionTime: compiled.executionTime,
      memoryUsed: compiled.memoryUsed,
      complexity: {
        bestCase,
        averageCase,
        worstCase,
        spaceComplexity
      }
    });
  } catch (err) {
    console.error('Execution error:', err);
    let errorMessage = err.toString();
    
    if (errorMessage.includes('Network error') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ETIMEDOUT')) {
      errorMessage = "Code execution service is temporarily unavailable. Please try again later.";
    } else if (errorMessage.includes('socket') || errorMessage.includes('timeout')) {
      errorMessage = "Request timed out. Please try again.";
    }
    
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.id;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const snippets = await Compile.find({ user: userId }).sort({ createdAt: -1 });
    
    const languageCounts = {};
    snippets.forEach(s => {
      languageCounts[s.language] = (languageCounts[s.language] || 0) + 1;
    });
    
    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const errorCount = snippets.filter(s => 
      s.output?.includes('Error') || s.output?.includes('error') || !s.output
    ).length;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const daySnippets = snippets.filter(s => {
        const snippetDate = new Date(s.createdAt);
        snippetDate.setHours(0, 0, 0, 0);
        return snippetDate.getTime() === date.getTime();
      });
      last7Days.push({ day: dayName, codes: daySnippets.length, runs: daySnippets.length * 2 });
    }

    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayNum = date.getDate();
      const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
      const daySnippets = snippets.filter(s => {
        const snippetDate = new Date(s.createdAt);
        return snippetDate.toDateString() === date.toDateString();
      });
      last30Days.push({ 
        name: i % 5 === 0 ? `${dayNum} ${monthShort}` : '', 
        codes: daySnippets.length,
        runs: daySnippets.length * 2
      });
    }

    res.json({
      success: true,
      stats: {
        totalCodes: snippets.length,
        totalRuns: snippets.length * 3,
        errorCount: errorCount,
        languagesUsed: Object.keys(languageCounts).length
      },
      topLanguages: sortedLanguages,
      weeklyData: last7Days,
      monthlyData: last30Days,
      recentSnippets: snippets.slice(0, 10)
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};

export const getUserSnippets = async (req, res) => {
  try {
    const userId = req.id;
    const { page = 1, limit = 10, language = '', search = '' } = req.query;
    
    const query = { user: userId };
    
    if (language) {
      query.language = language;
    }
    
    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }
    
    const snippets = await Compile.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Compile.countDocuments(query);
    
    res.json({
      success: true,
      snippets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Snippets error:', err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};

export const saveSnippet = async (req, res) => {
  try {
    const userId = req.id;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const { problemId, problemTitle, code, language, status, results } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }
    
    const title = problemTitle || `${language} - ${new Date().toLocaleString()}`;
    
    const existingSnippet = await Compile.findOne({ 
      user: userId, 
      problemId: problemId 
    }).sort({ createdAt: -1 });
    
    let snippet;
    if (existingSnippet) {
      existingSnippet.code = code;
      existingSnippet.language = language;
      existingSnippet.title = title;
      if (status) existingSnippet.output = status;
      existingSnippet.status = status;
      if (results) existingSnippet.results = results;
      snippet = await existingSnippet.save();
    } else {
      snippet = await Compile.create({
        user: userId,
        problemId,
        title,
        code,
        language,
        status,
        results
      });
    }
    
    // Update problem submission count
    if (problemId) {
      const incValue = status === 'success' ? { submissions: 1, solvedCount: 1 } : { submissions: 1 };
      await Problem.findByIdAndUpdate(problemId, {
        $inc: incValue
      });
    }
    
    // Update user's problem stats if solved
    if (status === 'success' && problemId) {
      const problem = await Problem.findById(problemId);
      if (problem) {
        const user = await User.findById(userId);
        if (user) {
          const problemIdStr = problemId.toString();
          const alreadySolved = user.problemStats?.solved?.some(id => id.toString() === problemIdStr);
          
          if (!alreadySolved) {
            // Update difficulty counts
            if (problem.difficulty === 'Easy') {
              user.easySolved = (user.easySolved || 0) + 1;
            } else if (problem.difficulty === 'Medium') {
              user.mediumSolved = (user.mediumSolved || 0) + 1;
            } else if (problem.difficulty === 'Hard') {
              user.hardSolved = (user.hardSolved || 0) + 1;
            }
            
            // Update problem stats arrays
            if (!user.problemStats) {
              user.problemStats = { solved: [], attempted: [] };
            }
            user.problemStats.solved.push(problemId);
            // Remove from attempted if it was there
            user.problemStats.attempted = user.problemStats.attempted?.filter(id => id.toString() !== problemIdStr) || [];
            
            await user.save();
          }
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Code saved successfully',
      data: snippet
    });
  } catch (err) {
    console.error('Save snippet error:', err);
    res.status(500).json({ success: false, message: 'Failed to save code', error: err.toString() });
  }
};

export const getSavedSnippets = async (req, res) => {
  try {
    const userId = req.id;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const { problemId } = req.query;
    
    const query = { user: userId };
    if (problemId) {
      query.problemId = problemId;
    }
    
    const snippets = await Compile.find(query)
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: snippets
    });
  } catch (err) {
    console.error('Get saved snippets error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch saved codes' });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.id;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const submissions = await Compile.find({ user: userId })
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(100);
    
    const formattedSubmissions = submissions.map(sub => ({
      _id: sub._id,
      problem: sub.problemId ? {
        _id: sub.problemId._id,
        title: sub.problemId.title,
        difficulty: sub.problemId.difficulty || 'Easy'
      } : { title: sub.problemTitle || 'Unknown', difficulty: 'Easy' },
      status: sub.status === 'success' ? 'Passed' : 'Failed',
      language: sub.language,
      time: sub.executionTime || '0',
      memory: sub.memoryUsed || '0',
      submittedAt: sub.createdAt
    }));
    
    // Get user problem stats
    const user = await User.findById(userId);
    const userStats = user ? {
      easySolved: user.easySolved || 0,
      mediumSolved: user.mediumSolved || 0,
      hardSolved: user.hardSolved || 0,
      totalSolved: (user.easySolved || 0) + (user.mediumSolved || 0) + (user.hardSolved || 0)
    } : { easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSolved: 0 };
    
    const stats = {
      total: formattedSubmissions.length,
      accepted: formattedSubmissions.filter(s => s.status === 'Passed').length,
      rejected: formattedSubmissions.filter(s => s.status !== 'Passed').length,
      ...userStats
    };
    
    res.json({
      success: true,
      data: formattedSubmissions,
      stats
    });
  } catch (err) {
    console.error('Get user submissions error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
};
