export const COLORS = {
  primary: 'green-600',
  secondary: 'teal-500',
  danger: 'red-600',
  success: 'green-500'
};

export const BUTTON_STYLES = {
  primary: 'bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition font-semibold',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition font-medium',
  danger: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-semibold'
};

export const DEFAULT_CODE = {
  javascript: `// JavaScript\nconsole.log("Hello, world!");`,
  typescript: `// TypeScript\nconsole.log("Hello, world!");`,
  python: `# Python\nprint("Hello, world!")`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}`,
  c: `#include <stdio.h>\nint main() {\n  printf("Hello, world!\\n");\n  return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, world!" << endl;\n  return 0;\n}`,
  csharp: `using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, world!");\n  }\n}`,
  go: `package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, world!")\n}`,
  rust: `fn main() {\n  println!("Hello, world!");\n}`,
  ruby: `puts "Hello, world!"`,
  php: `<?php\necho "Hello, world!\\n";\n?>`,
  swift: `print("Hello, world!")`,
  kotlin: `fun main() {\n  println("Hello, world!")\n}`,
  scala: `object Main extends App {\n  println("Hello, world!")\n}`,
  perl: `print "Hello, world!\\n";`,
  r: `cat("Hello, world!\\n")`,
  lua: `print("Hello, world!")`,
  haskell: `main = putStrLn "Hello, world!"`,
  elixir: `IO.puts("Hello, world!")`,
  julia: `println("Hello, world!")`,
  dart: `void main() {\n  print("Hello, world!");\n}`,
  bash: `echo "Hello, world!"`,
  powershell: `Write-Host "Hello, world!"`
};

export const EDITOR_OPTIONS = {
  fontSize: 16,
  minimap: { enabled: false },
  wordWrap: 'on',
  automaticLayout: true,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'all',
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  tabSize: 2
};
