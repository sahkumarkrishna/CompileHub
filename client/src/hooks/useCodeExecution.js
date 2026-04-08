import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useCodeExecution = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const executeCode = async (language, code, input) => {
    setLoading(true);
    setOutput('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const COMPILE_URL = `${API_URL}/compile`;
      const res = await axios.post(COMPILE_URL, { language, code, input });
      const data = res.data;
      const runOutput = `Output:\n${data.output}\n\nExecution Time: ${data.executionTime}\nMemory Used: ${data.memoryUsed}`;
      setOutput(runOutput);

      const savedSnippets = JSON.parse(localStorage.getItem('codeSnippets')) || [];
      savedSnippets.unshift({
        title: `Snippet ${new Date().toLocaleString()}`,
        language,
        code,
        input,
        output: runOutput,
        saved: false,
      });
      localStorage.setItem('codeSnippets', JSON.stringify(savedSnippets));
      toast.success('Saved to history!');
      return data;
    } catch (err) {
      const errorMsg = 'Error: ' + (err.response?.data?.error || err.message);
      setOutput(errorMsg);
      toast.error('Failed to run code.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeCode, loading, output, setOutput };
};
