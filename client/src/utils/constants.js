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
  javascript: `// Write JS code here\nconsole.log("Hello, world!");`,
  python: `# Write Python code here\nprint("Hello, world!")`,
  c: `#include <stdio.h>\nint main() {\n  printf("Hello, world!\\n");\n  return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, world!" << endl;\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}`,
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
