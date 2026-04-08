import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
}, { _id: false });

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' }
}, { _id: false });

const problemSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Problem title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: { 
      type: String, 
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    difficulty: { 
      type: String, 
      enum: ['Easy', 'Medium', 'Hard', 'Best'],
      required: [true, 'Difficulty is required'],
      default: 'Easy'
    },
    description: { 
      type: String, 
      required: [true, 'Description is required']
    },
    topics: [{ 
      type: String,
      trim: true
    }],
    companies: [{
      type: String,
      trim: true
    }],
    constraints: [{
      type: String,
      trim: true
    }],
    hints: [{
      type: String,
      trim: true
    }],
    examples: [exampleSchema],
    testCases: [testCaseSchema],
    timeComplexity: { 
      type: String, 
      default: ''
    },
    spaceComplexity: { 
      type: String, 
      default: ''
    },
    acceptance: { 
      type: String, 
      default: ''
    },
    difficultyRating: { 
      type: String, 
      default: ''
    },
    premium: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active'
    },
    submissions: {
      type: Number,
      default: 0
    },
    solvedCount: {
      type: Number,
      default: 0
    },
    relatedProblems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }],
    tags: [{
      type: String,
      trim: true
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

problemSchema.index({ title: 'text', description: 'text' });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ topics: 1 });
problemSchema.index({ companies: 1 });
problemSchema.index({ premium: 1 });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
