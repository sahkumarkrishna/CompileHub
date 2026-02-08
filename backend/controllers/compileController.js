import Compile from "../models/Compile.js";
import { runJavaScript, runPython, runC_CPP, runJava } from "../utils/jsExecutor.js";

function analyzeComplexity(code, language) {
  const loops = (code.match(/for|while|forEach|map|filter|reduce/gi) || []).length;
  const nestedLoops = (code.match(/for[\s\S]*?for|while[\s\S]*?while/gi) || []).length;
  const recursion = (code.match(/function\s+\w+[\s\S]*?\1\(/gi) || []).length;
  const arrays = (code.match(/\[\]|new Array|list\(|vector</gi) || []).length;
  const sorting = (code.match(/sort|Sort|sorted/gi) || []).length;

  let bestCase = "O(1)";
  let averageCase = "O(1)";
  let worstCase = "O(1)";
  let spaceComplexity = "O(1)";

  if (sorting > 0) {
    bestCase = "O(n log n)";
    averageCase = "O(n log n)";
    worstCase = "O(n²)";
  } else if (nestedLoops > 0) {
    bestCase = "O(n)";
    averageCase = "O(n²)";
    worstCase = "O(n²)";
  } else if (loops > 0) {
    bestCase = "O(1)";
    averageCase = "O(n)";
    worstCase = "O(n)";
  } else if (recursion > 0) {
    bestCase = "O(n)";
    averageCase = "O(2^n)";
    worstCase = "O(2^n)";
  }

  if (arrays > 0 || recursion > 0) spaceComplexity = "O(n)";

  return { bestCase, averageCase, worstCase, spaceComplexity };
}

export const compileCode = async (req, res) => {
  const { language, code, input } = req.body;

  console.log('Compile request received:', { language, codeLength: code?.length, input });

  if (!language || !code) {
    console.log('Missing required fields:', { language: !!language, code: !!code });
    return res.status(400).json({ success: false, error: "Missing language or code" });
  }

  try {
    let execRes;

    switch (language) {
      case "javascript":
        execRes = await runJavaScript(code, input);
        break;
      case "python":
        execRes = await runPython(code, input);
        break;
      case "c":
      case "cpp":
        execRes = await runC_CPP(code, language, input);
        break;
      case "java":
        execRes = await runJava(code, input);
        break;
      case "rust":
        return res.status(400).json({ success: false, error: "Rust support coming soon!" });
      default:
        return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    const { bestCase, averageCase, worstCase, spaceComplexity } = analyzeComplexity(code, language);

    const compiled = await Compile.create({
      language,
      code,
      output: execRes.stdout,
      executionTime: execRes.executionTime,
      memoryUsed: execRes.memoryUsed,
    });

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
    res.status(400).json({ success: false, error: err.toString() });
  }
};
