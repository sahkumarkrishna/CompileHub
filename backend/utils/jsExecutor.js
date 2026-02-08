import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure temp directory exists
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// Create temp file
const createTempFile = (extension, code, className = null) => {
  let filename;

  if (extension === "java" && className) {
    filename = `${className}.java`; // Java requires filename = classname
  } else {
    filename = `${uuid()}.${extension}`;
  }

  const filePath = path.join(tempDir, filename);
  fs.writeFileSync(filePath, code);
  return filePath;
};

// Cleanup file (optional)
const cleanupFile = (filePath) => {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};


// Detect Python command
const detectPythonCommand = () => {
  const candidates = ["python", "python3", "py"];
  return new Promise((resolve, reject) => {
    const tryNext = (i) => {
      if (i >= candidates.length) return reject("Python not found");
      exec(`${candidates[i]} --version`, (err) => {
        if (!err) return resolve(candidates[i]);
        tryNext(i + 1);
      });
    };
    tryNext(0);
  });
};


// JavaScript Runner
export const runJavaScript = async (code, input = "") => {
  return new Promise((resolve, reject) => {
    try {
      const start = process.hrtime();
      const startMem = process.memoryUsage().rss;
      let output = "";
      const inputs = input.split('\n').filter(line => line.trim());
      let inputIndex = 0;

      const originalLog = console.log;
      console.log = (...args) => {
        output += args.join(" ") + "\n";
      };

      // Mock prompt to return input values
      global.prompt = (message) => {
        let value = inputs[inputIndex] || "";
        inputIndex++;
        // Extract first number if multiple values on same line
        value = value.trim().split(/\s+/)[0];
        output += `${message} ${value}\n`;
        return value;
      };

      // Mock alert to log output (only if not already logged)
      global.alert = (message) => {
        // Don't add if console.log already added it
        if (!output.includes(message)) {
          output += message + "\n";
        }
      };

      eval(code);

      console.log = originalLog;
      delete global.prompt;
      delete global.alert;

      const [s, ns] = process.hrtime(start);
      resolve({
        stdout: output.trim() || "No output",
        executionTime: `${(s * 1e3 + ns / 1e6).toFixed(2)} ms`,
        memoryUsed: `${((process.memoryUsage().rss - startMem) / 1024 / 1024).toFixed(2)} MB`,
      });
    } catch (err) {
      reject("JavaScript Error: " + err.message);
    }
  });
};

// Python Runner
export const runPython = async (code, input = "") => {
  const filePath = createTempFile("py", code);
  const python = await detectPythonCommand();

  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    const startMem = process.memoryUsage().rss;

    // Pass input via stdin
    const child = exec(`${python} "${filePath}"`, (err, stdout, stderr) => {
      const [s, ns] = process.hrtime(start);
      cleanupFile(filePath);
      if (err) return reject("Python Error: " + (stderr || err.message));
      resolve({
        stdout: stdout.trim() || "No output",
        executionTime: `${(s * 1e3 + ns / 1e6).toFixed(2)} ms`,
        memoryUsed: `${((process.memoryUsage().rss - startMem) / 1024 / 1024).toFixed(2)} MB`,
      });
    });

    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
};

// C/C++ Runner
export const runC_CPP = async (code, language, input = "") => {
  const ext = language === "c" ? "c" : "cpp";
  const filePath = createTempFile(ext, code);
  const outPath = filePath.replace(`.${ext}`, "");
  const compiler = language === "c" ? "gcc" : "g++";

  return new Promise((resolve, reject) => {
    exec(`${compiler} "${filePath}" -o "${outPath}"`, (err, _, stderr) => {
      if (err) return reject("Compilation Error: " + stderr);

      const start = process.hrtime();
      const startMem = process.memoryUsage().rss;
      const child = exec(`"${outPath}"`, (err2, stdout, stderr2) => {
        const [s, ns] = process.hrtime(start);
        cleanupFile(filePath);
        cleanupFile(outPath);
        if (err2) return reject("Runtime Error: " + stderr2);
        resolve({
          stdout: stdout.trim() || "No output",
          executionTime: `${(s * 1e3 + ns / 1e6).toFixed(2)} ms`,
          memoryUsed: `${((process.memoryUsage().rss - startMem) / 1024 / 1024).toFixed(2)} MB`,
        });
      });

      if (input) child.stdin.write(input);
      child.stdin.end();
    });
  });
};

// Check if Java is installed
const checkJavaInstalled = () => {
  return new Promise((resolve) => {
    exec('javac -version', (err) => {
      resolve(!err);
    });
  });
};

// Java Runner with fallback to online API
export const runJava = async (code, input = "") => {
  const javaInstalled = await checkJavaInstalled();

  if (!javaInstalled) {
    // Use JDoodle API as fallback
    return runJavaOnline(code, input);
  }

  const match = code.match(/public\s+class\s+(\w+)/);
  const className = match ? match[1] : "Main";
  const filePath = createTempFile("java", code, className);

  return new Promise((resolve, reject) => {
    exec(`javac "${filePath}"`, (err, stdout, stderr) => {
      if (err) {
        cleanupFile(filePath);
        return reject("Java Compilation Error:\n" + (stderr || stdout));
      }

      const start = process.hrtime();
      const startMem = process.memoryUsage().rss;

      const child = exec(`java -cp "${tempDir}" ${className}`, (err2, stdout2, stderr2) => {
        const [s, ns] = process.hrtime(start);

        cleanupFile(filePath);
        cleanupFile(path.join(tempDir, `${className}.class`));

        if (err2) return reject("Java Runtime Error:\n" + (stderr2 || stdout2));

        resolve({
          stdout: stdout2.trim() || "No output",
          executionTime: `${(s * 1e3 + ns / 1e6).toFixed(2)} ms`,
          memoryUsed: `${((process.memoryUsage().rss - startMem) / 1024 / 1024).toFixed(2)} MB`,
        });
      });

      if (input) child.stdin.write(input);
      child.stdin.end();
    });
  });
};

// Online Java execution using Piston API (free)
const runJavaOnline = async (code, input = "") => {
  const https = await import('https');
  const start = Date.now();
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      language: "java",
      version: "15.0.2",
      files: [{
        content: code
      }],
      stdin: input
    });

    const options = {
      hostname: 'emkc.org',
      port: 443,
      path: '/api/v2/piston/execute',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          const executionTime = Date.now() - start;
          
          // Estimate memory based on code complexity
          const codeLength = code.length;
          const estimatedMemory = (8 + (codeLength / 100)).toFixed(2);
          
          if (result.compile && result.compile.code !== 0) {
            reject("Java Compilation Error:\n" + result.compile.stderr);
          } else if (result.run && result.run.code !== 0 && result.run.stderr) {
            reject("Java Runtime Error:\n" + result.run.stderr);
          } else {
            resolve({
              stdout: result.run.stdout || result.run.output || "No output",
              executionTime: `${executionTime} ms`,
              memoryUsed: `${estimatedMemory} MB`,
            });
          }
        } catch (err) {
          reject("Failed to execute Java code: " + err.message);
        }
      });
    });

    req.on('error', (err) => {
      reject("Network error: " + err.message);
    });

    req.write(data);
    req.end();
  });
};
