import React, { useState } from 'react';
import { Play, Code2, Sparkles } from 'lucide-react';

const demoVideos = {
  python: {
    name: 'Python',
    url: 'https://www.youtube.com/embed/rfscVS0vtbw',
    description: [
      'Python is a powerful and easy-to-learn language used for web development, data analysis, AI, and automation.',
      'It has a simple syntax that mimics natural language, making it ideal for beginners.',
      'With huge libraries like Pandas, TensorFlow, and Flask, Python is versatile and in high demand.',
    ]
  },
  javascript: {
    name: 'JavaScript',
    url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
    description: [
      'JavaScript is the backbone of web development, enabling dynamic, interactive user experiences.',
      'It works seamlessly with HTML and CSS and runs in all modern browsers.',
      'With frameworks like React, Vue, and Node.js, JavaScript powers both frontend and backend development.',
      'You can also build native mobile apps using JavaScript via React Native.',
      'It has a vast ecosystem of libraries and is essential for modern web development.'
    ]
  },
  java: {
    name: 'Java',
    url: 'https://www.youtube.com/embed/grEKMHGYyns',
    description: [
      'Java is a robust, object-oriented language widely used for building enterprise applications.',
      'It’s known for its portability – "write once, run anywhere".',
      'Java powers Android apps, backend systems, and large-scale financial platforms.',
      'Java has a strong community and a mature ecosystem with tools like Spring Boot and Hibernate.'
    ]
  },
  c: {
    name: 'C Programming',
    url: 'https://www.youtube.com/embed/KJgsSFOSQv0',
    description: [
      'C is a foundational programming language known for performance and low-level memory manipulation.',
      'It’s often used in system programming, embedded devices, and operating systems.',
      'Learning C gives you insight into how computers really work under the hood.',
      'It’s commonly used in kernel and compiler development.'
    ]
  },
  cpp: {
    name: 'C++ Programming',
    url: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
    description: [
      'C++ is an extension of C, supporting both procedural and object-oriented programming.',
      'It’s widely used in game development, real-time systems, and performance-critical applications.',
      'With concepts like classes, inheritance, and templates, C++ offers both power and complexity.',
      'Modern C++ (C++11 and later) includes features like smart pointers, lambdas, and concurrency support.'
    ]
  }
};

export default function WatchDemo() {
  const [selectedLang, setSelectedLang] = useState('python');
  const currentVideo = demoVideos[selectedLang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Play className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Watch Language Demos
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Learn programming languages through interactive video tutorials</p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center">
          <div className="inline-flex gap-2 p-2 bg-white rounded-xl shadow-lg flex-wrap justify-center">
            {Object.entries(demoVideos).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => setSelectedLang(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedLang === key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
                <Code2 className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">{currentVideo.name} Tutorial</h2>
              </div>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={currentVideo.url}
                  title={`${currentVideo.name} Demo`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-800">About {currentVideo.name}</h3>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed max-h-[400px] overflow-y-auto">
                {currentVideo.description.map((text, index) => (
                  <p key={index} className="text-sm">{text}</p>
                ))}
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-600">
                  <p className="text-sm font-semibold text-gray-800">
                    Ready to explore <span className="text-indigo-600">{currentVideo.name}</span>?
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Start coding now on CompileHub!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
