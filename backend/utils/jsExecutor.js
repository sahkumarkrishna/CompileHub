import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// ============================================
// Judge0 CE API (Free public instance)
// ============================================
const runWithJudge0 = async (languageId, sourceCode, stdin = "", extraArgs = {}) => {
  const https = await import('https');
  const start = Date.now();
  
  // Ensure code ends with newline
  let finalCode = sourceCode;
  if (!sourceCode.endsWith('\n')) {
    finalCode = sourceCode + '\n';
  }
  
  return new Promise((resolve, reject) => {
    const base64Code = Buffer.from(finalCode).toString('base64');
    const base64Stdin = Buffer.from(stdin).toString('base64');
    
    const payload = {
      source_code: base64Code,
      language_id: languageId,
      stdin: base64Stdin,
      compile_timeout: 10000,
      cpu_time_limit: 5,
      memory_limit: 128000,
      ...extraArgs
    };
    
    const data = JSON.stringify(payload);

    const options = {
      hostname: 'ce.judge0.com',
      port: 443,
      path: '/submissions?base64_encoded=true&wait=true',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          const executionTime = Date.now() - start;
          const statusId = result.status?.id;
          
          if (statusId >= 6) {
            const output = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : "Compilation error";
            reject("Compilation Error: " + output);
          } else if (statusId >= 12) {
            const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : "Runtime error";
            reject("Runtime Error: " + stderr);
          } else if (result.stdout) {
            const stdout = Buffer.from(result.stdout, 'base64').toString();
            const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
            
            console.log('Judge0 result - stdout:', stdout, 'stderr:', stderr, 'status:', result.status);
            
            resolve({
              stdout: stdout.trim() || stderr || "Program ran but produced no output",
              executionTime: `${executionTime} ms`,
              memoryUsed: `${Math.ceil((result.memory || 0) / 1024)} MB`
            });
          } else {
            resolve({
              stdout: "No output",
              executionTime: `${executionTime} ms`,
              memoryUsed: "0 MB"
            });
          }
        } catch (err) {
          reject("Execution failed: " + err.message);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Judge0 request error:', err);
      reject("Network error: " + err.message);
    });
    req.write(data);
    req.end();
  });
};

const languageIds = {
  python: 71,      // Python 3.8.1
  java: 62,       // Java (OpenJDK 13.0.1)
  c: 48,          // C (GCC 7.4.0)
  cpp: 52,        // C++ (GCC 7.4.0)
  ruby: 72,       // Ruby 2.7.0
  go: 60,         // Go 1.13.5
  rust: 73,       // Rust 1.40.0
  php: 68,        // PHP 7.4.1
  swift: 83,      // Swift 5.2.3
  kotlin: 78,     // Kotlin 1.3.70
  scala: 82,      // Scala 2.13.2
  perl: 85,       // Perl 5.28.1
  lua: 84,        // Lua 5.3.5
  haskell: 61,    // Haskell (GHC 8.8.1)
  bash: 46,       // Bash 5.0.0
  csharp: 51,     // C# (Mono 6.6.0.161)
  r: 80,          // R (4.0.0)
  dart: 90,       // Dart (2.19.2)
  typescript: 74, // TypeScript 3.7.4
  elixir: 57,     // Elixir 1.9.4
  fsharp: 87,     // F# (.NET Core)
  objectivec: 79, // Objective-C (Clang 7.0.1)
  vb: 84          // Visual Basic.Net
};

// ============================================
// JavaScript Runner (Local - no external API needed)
// ============================================
export const runJavaScript = async (code, input = "") => {
  return new Promise((resolve, reject) => {
    try {
      const start = process.hrtime();
      let output = "";
      const inputs = input.split('\n').filter(line => line.trim());
      let inputIndex = 0;

      const originalLog = console.log;
      console.log = (...args) => { output += args.join(" ") + "\n"; };

      global.prompt = (message) => {
        let value = inputs[inputIndex] || "";
        inputIndex++;
        output += `${message} ${value}\n`;
        return value;
      };

      global.alert = (message) => {
        if (!output.includes(message)) output += message + "\n";
      };

      // Run the code directly - user code already has console.log statements
      eval(code);

      console.log = originalLog;
      delete global.prompt;
      delete global.alert;

      const [s, ns] = process.hrtime(start);
      resolve({
        stdout: output.trim() || "No output",
        executionTime: `${(s * 1e3 + ns / 1e6).toFixed(2)} ms`,
        memoryUsed: "0 MB"
      });
    } catch (err) {
      reject("JavaScript Error: " + err.message);
    }
  });
};

// Strip TypeScript for JS execution
const stripTypeScript = (code) => {
  let js = code;
  js = js.replace(/(let|const|var)\s+(\w+)\s*:\s*[\w\[\]<>]+\s*=/g, '$1 $2 =');
  js = js.replace(/\((\w+)\s*:\s*[\w\[\]<>]+\)/g, '($1)');
  js = js.replace(/<[^>]+>/g, '');
  js = js.replace(/\s+as\s+\w+/g, '');
  js = js.replace(/\breadonly\s+/g, '');
  js = js.replace(/(\w)!/g, '$1');
  return js;
};

export const runTypeScript = async (code, input = "") => {
  return runJavaScript(stripTypeScript(code), input);
};

// ============================================
// Language runners using Judge0 CE
// ============================================
export const runPython = async (code, input = "") => {
  return runWithJudge0(languageIds.python, code, input);
};

export const runJava = async (code, input = "") => {
  let javaCode = code;
  
  const hasMainMethod = /public\s+static\s+void\s+main\s*\(\s*String/.test(code);
  const hasClassDefinition = /class\s+\w+\s*\{/.test(code);
  
  if (hasMainMethod && hasClassDefinition) {
    return runWithJudge0(languageIds.java, javaCode, input);
  }
  
  if (hasClassDefinition) {
    javaCode = javaCode.replace(/class\s+(\w+)/, 'class Main');
    if (!hasMainMethod) {
      javaCode = javaCode.replace(/\}$/, '\n    public static void main(String[] args) {\n        \n    }\n}');
    }
  } else {
    javaCode = `public class Main {\n    public static void main(String[] args) {\n${code}\n    }\n}`;
  }
  
  return runWithJudge0(languageIds.java, javaCode, input);
};

export const runC_CPP = async (code, language, input = "") => {
  const langId = language === "c" ? languageIds.c : languageIds.cpp;
  
  let processedCode = code;
  if (!code.endsWith('\n')) {
    processedCode = code + '\n';
  }
  
  const extraArgs = language === "c" ? { compiler_args: ["-x", "c"] } : {};
  
  return runWithJudge0(langId, processedCode, input, extraArgs);
};

export const runRuby = async (code, input = "") => {
  return runWithJudge0(languageIds.ruby, code, input);
};

export const runGo = async (code, input = "") => {
  return runWithJudge0(languageIds.go, code, input);
};

export const runRust = async (code, input = "") => {
  return runWithJudge0(languageIds.rust, code, input);
};

export const runPHP = async (code, input = "") => {
  return runWithJudge0(languageIds.php, code, input);
};

export const runSwift = async (code, input = "") => {
  let processedCode = code;
  if (!code.endsWith('\n')) {
    processedCode = code + '\n';
  }
  return runWithJudge0(languageIds.swift, processedCode, input);
};

export const runKotlin = async (code, input = "") => {
  return runWithJudge0(languageIds.kotlin, code, input);
};

export const runScala = async (code, input = "") => {
  return runWithJudge0(languageIds.scala, code, input);
};

export const runPerl = async (code, input = "") => {
  return runWithJudge0(languageIds.perl, code, input);
};

export const runLua = async (code, input = "") => {
  return runWithJudge0(languageIds.lua, code, input);
};

export const runHaskell = async (code, input = "") => {
  return runWithJudge0(languageIds.haskell, code, input);
};

export const runBash = async (code, input = "") => {
  return runWithJudge0(languageIds.bash, code, input);
};

export const runCSharp = async (code, input = "") => {
  return runWithJudge0(languageIds.csharp, code, input);
};

export const runR = async (code, input = "") => {
  return runWithJudge0(languageIds.r, code, input);
};

export const runDart = async (code, input = "") => {
  return runWithJudge0(languageIds.dart, code, input);
};

export const runJulia = async (code, input = "") => {
  return runWithJudge0(languageIds.julia, code, input);
};

export const runElixir = async (code, input = "") => {
  return runWithJudge0(languageIds.elixir, code, input);
};

export const runPowerShell = async (code, input = "") => {
  return runWithJudge0(languageIds.powershell, code, input);
};
