const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/compilehub').then(async () => {
  const Problem = mongoose.model('Problem', new mongoose.Schema({}, {strict: false}));
  
  // Update test case 3 input to match example format
  const p = await Problem.findOne({slug: 'longest-increasing-subsequence'});
  p.testCases[2].input = 'nums = [7,7,7,7,7,7,7]';
  await p.save();
  
  console.log('Test cases after update:');
  p.testCases.forEach((tc, i) => console.log(i+1 + ':', tc.input, '->', tc.output));
  
  mongoose.disconnect();
});