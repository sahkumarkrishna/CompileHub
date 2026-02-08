import React, { useState } from 'react';

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
    <div className="p-6 max-w-7xl mx-auto text-gray-800 space-y-8">
      <h1 className="text-3xl font-bold mb-4">👀 Watch Language Demos</h1>

      <select
        className="mb-6 p-2 border border-gray-300 rounded shadow-sm"
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
      >
        {Object.entries(demoVideos).map(([key, lang]) => (
          <option key={key} value={key}>{lang.name}</option>
        ))}
      </select>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Video Section */}
        <div className="w-full lg:w-[700px]">
          <div className="w-full h-[400px]">
            <iframe
              className="w-full h-full rounded shadow-lg"
              src={currentVideo.url}
              title={`${currentVideo.name} Demo`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:flex-1 bg-teal-100 p-6 rounded-lg text-gray-900 text-lg leading-relaxed max-h-[500px] overflow-y-auto space-y-4">
          {currentVideo.description.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          <p className="text-sm text-gray-700">
            Ready to explore <strong>{currentVideo.name}</strong>? <span className="text-green-700 font-semibold">Start now on CompileHub!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
