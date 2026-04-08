import { useState } from "react";
import { FiHelpCircle, FiCode, FiPlay, FiClock, FiSettings, FiUser, FiMail, FiMessageSquare, FiExternalLink, FiShield, FiTrendingUp, FiDatabase, FiLock, FiDownload, FiShare2, FiCopy, FiMoon, FiSun, FiMaximize2, FiMinimize2, FiTerminal, FiCpu, FiAlertTriangle, FiCheckCircle, FiZap, FiBook, FiVideo, FiPhone, FiMessageCircle, FiTwitter, FiGithub, FiCommand } from "react-icons/fi";
import ContactForm from "../components/ContactForm";

const HelpPage = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedItem, setExpandedItem] = useState(null);

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: <FiHelpCircle className="w-5 h-5" />, color: "emerald" },
    { id: "quick-start", label: "Quick Start Guide", icon: <FiZap className="w-5 h-5" />, color: "yellow" },
    { id: "compiler", label: "Using the Compiler", icon: <FiCode className="w-5 h-5" />, color: "blue" },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: <FiCommand className="w-5 h-5" />, color: "purple" },
    { id: "features", label: "Features Guide", icon: <FiTrendingUp className="w-5 h-5" />, color: "cyan" },
    { id: "problems", label: "Problems & Practice", icon: <FiBook className="w-5 h-5" />, color: "pink" },
    { id: "account", label: "Account & Profile", icon: <FiUser className="w-5 h-5" />, color: "orange" },
    { id: "admin", label: "Admin Panel", icon: <FiSettings className="w-5 h-5" />, color: "purple" },
    { id: "troubleshooting", label: "Troubleshooting", icon: <FiAlertTriangle className="w-5 h-5" />, color: "red" },
    { id: "security", label: "Privacy & Security", icon: <FiShield className="w-5 h-5" />, color: "green" },
    { id: "contact", label: "Contact Us", icon: <FiPhone className="w-5 h-5" />, color: "indigo" },
  ];

  const content = {
    "getting-started": {
      title: "Getting Started with CompileHub",
      description: "Learn the basics and get up and running with CompileHub in minutes.",
      items: [
        { q: "Welcome to CompileHub!", a: "CompileHub is a free, online code editor and compiler that lets you write, run, and test code in 20+ programming languages directly from your browser. No installation required!" },
        { q: "How do I create an account?", a: "Click on the Login button in the navbar and sign up with your email address. You can also use Google authentication for quick signup. Fill in your details and start coding immediately." },
        { q: "How do I start coding?", a: "Navigate to the Compiler page and select your preferred programming language from the dropdown menu. Write your code in the editor and click Run to execute. It's that simple!" },
        { q: "Is CompileHub completely free?", a: "Yes! CompileHub is 100% free for all users. You can code in 20+ programming languages without any charges. No hidden fees, no premium subscriptions, no limitations." },
        { q: "Which browsers are supported?", a: "CompileHub works on all modern browsers: Chrome (recommended), Firefox, Safari, Microsoft Edge, and Opera. For the best experience, use the latest version of Chrome or Firefox." },
        { q: "Do I need to install any software?", a: "Not at all! CompileHub is fully web-based. Just open your browser, go to our website, and start coding. No downloads, no installations, no configuration needed." },
        { q: "Can I use CompileHub on mobile devices?", a: "Absolutely! CompileHub is fully responsive and works great on smartphones and tablets. Write, run, and save code from anywhere using your mobile browser." },
        { q: "What programming languages are supported?", a: "We support: JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala, Perl, R, Lua, Haskell, Julia, Dart, Bash, and PowerShell." },
      ]
    },
    "quick-start": {
      title: "Quick Start Guide",
      description: "Get coding in just 4 simple steps.",
      steps: [
        { step: 1, title: "Sign Up / Log In", desc: "Create a free account or log in to save your code and track your progress.", icon: <FiUser className="w-6 h-6" /> },
        { step: 2, title: "Select Language", desc: "Choose your preferred programming language from the dropdown menu.", icon: <FiCode className="w-6 h-6" /> },
        { step: 3, title: "Write Code", desc: "Use our powerful Monaco editor to write clean, syntax-highlighted code.", icon: <FiTerminal className="w-6 h-6" /> },
        { step: 4, title: "Run & Save", desc: "Click Run to execute your code. Results appear instantly in the output panel.", icon: <FiPlay className="w-6 h-6" /> },
      ]
    },
    "compiler": {
      title: "Using the Compiler",
      description: "Master the compiler features and become a power user.",
      items: [
        { q: "How do I run my code?", a: "Click the green 'Run Code' button in the toolbar or use the keyboard shortcut Ctrl+Enter (Cmd+Enter on Mac). The output appears in the output panel below the editor." },
        { q: "Can I save my code?", a: "Yes! Every time you run code, it's automatically saved to your history. You can also manually save by clicking the Save button. Access all saved code from the History page." },
        { q: "How do I change the programming language?", a: "Click the language dropdown at the top of the editor. Select from 20+ languages. The editor will automatically update with syntax highlighting for that language." },
        { q: "How do I provide custom input?", a: "Use the input panel on the right side of the screen. Type your input data there before running your code. The program will read this input during execution." },
        { q: "Where can I see execution metrics?", a: "After running code, the Performance panel shows execution time (in ms) and memory usage (in MB). This helps you optimize your code for better performance." },
        { q: "Can I download my code?", a: "Yes! Click the Download button to save your code as a file. The file will be named appropriately with the correct extension for your selected language." },
        { q: "How do I copy code?", a: "Click the Copy button to copy your entire code to clipboard. You can also select text and use Ctrl+C (Cmd+C on Mac). The copied code can be pasted anywhere." },
        { q: "Can I share my code?", a: "Yes! Click the Share button to generate a shareable link. Anyone with the link can view your code. Perfect for asking questions or showing solutions." },
        { q: "How do I toggle dark/light theme?", a: "Click the theme toggle button (sun/moon icon) to switch between dark and light mode. Your preference is saved for future sessions." },
        { q: "Can I use fullscreen mode?", a: "Yes! Click the fullscreen button to enter distraction-free mode. The editor expands to fill the entire screen. Press Escape or click the button again to exit." },
      ]
    },
    "shortcuts": {
      title: "Keyboard Shortcuts",
      description: "Speed up your coding with these keyboard shortcuts.",
      shortcuts: [
        { key: "Ctrl + Enter", action: "Run Code", category: "General" },
        { key: "Ctrl + S", action: "Save Code", category: "General" },
        { key: "Ctrl + C", action: "Copy Code", category: "General" },
        { key: "Ctrl + V", action: "Paste Code", category: "General" },
        { key: "Ctrl + Z", action: "Undo", category: "Editor" },
        { key: "Ctrl + Shift + Z", action: "Redo", category: "Editor" },
        { key: "Ctrl + D", action: "Duplicate Line", category: "Editor" },
        { key: "Ctrl + /", action: "Toggle Comment", category: "Editor" },
        { key: "Alt + Up/Down", action: "Move Line Up/Down", category: "Editor" },
        { key: "Ctrl + F", action: "Find", category: "Search" },
        { key: "Ctrl + H", action: "Find and Replace", category: "Search" },
        { key: "Escape", action: "Exit Fullscreen", category: "View" },
      ]
    },
    "features": {
      title: "Features Guide",
      description: "Explore all the features CompileHub has to offer.",
      items: [
        { q: "What is the Dashboard?", a: "The Dashboard is your personal command center. It shows: Total codes written, Total runs, Error rates, Language breakdown pie chart, Weekly activity graph, Success rate indicator, and Your coding streaks." },
        { q: "How do I view my code history?", a: "Click on 'History' in the sidebar. You'll see all your saved code snippets organized by date. Use filters to search by language or keywords. Click any snippet to view or edit it." },
        { q: "What is Total Codes?", a: "Total Codes page displays all your code snippets organized by programming language. See how many codes you've written in each language with visual statistics." },
        { q: "What is Total Runs?", a: "Total Runs shows your execution history including: Daily run counts, Weekly and monthly activity charts, Success vs error ratios, Most used languages, and Peak coding times." },
        { q: "What is Error Codes?", a: "Error Codes page helps you track and improve by showing: Your success rate percentage, Total errors encountered, Error breakdown by type, Weekly error trends, and Tips to reduce errors." },
        { q: "What is Submissions?", a: "Submissions page shows all your problem submissions. View: Submitted code, Test case results (passed/failed), Execution time, Memory used, Submission timestamp, and Problem details." },
        { q: "What is Settings?", a: "Settings page allows you to: Update profile (name, email, photo), Change password, Manage notification preferences, View account statistics, Delete account, and Customize editor theme." },
        { q: "Can I edit saved code?", a: "Yes! Go to History, click on any code snippet, and edit it in the editor. Changes are saved automatically. You can run the edited version and see new results." },
        { q: "Can I delete saved code?", a: "Of course! In the History page, find the code you want to delete and click the trash icon. Confirm deletion and the code will be permanently removed." },
        { q: "How do I update my profile?", a: "Go to Profile > Settings to update: Your display name, Email address, Profile photo, Password, and Notification preferences." },
        { q: "What are All Problems?", a: "All Problems is a curated collection of coding challenges. Browse by: Difficulty (Easy, Medium, Hard), Topic (Arrays, Strings, Trees, Graphs, etc.), Company, and Acceptance rate. Practice for interviews!" },
        { q: "What is Problem Detail?", a: "Problem Detail page shows: Problem description with examples, Input/Output format, Constraints, Hints (if available), Sample test cases, Submit button, and Solution discussion." },
        { q: "How do I filter problems?", a: "Use the filter options: Search by title, Filter by difficulty, Filter by topic, Sort by acceptance rate, Sort by difficulty, and Filter by company." },
        { q: "What is Watch Demo?", a: "Watch Demo page provides video tutorials showing how to use CompileHub features. Learn from step-by-step demonstrations." },
        { q: "What is Compile Code (without login)?", a: "You can use the compiler without logging in! Navigate to /compileCode to write and run code. Note: Your code won't be saved to your account." },
      ]
    },
    "problems": {
      title: "Problems & Practice",
      description: "Practice coding with our curated problem sets.",
      items: [
        { q: "How do I access practice problems?", a: "Go to 'All Problems' to browse our curated collection of coding challenges. Problems are categorized by difficulty: Easy, Medium, and Hard." },
        { q: "How do I solve a problem?", a: "Click on any problem to open the Problem Detail page. Read the description, examples, and constraints. Write your solution in the code editor and click Submit to test." },
        { q: "How are problems organized?", a: "Problems are organized by: Difficulty level (Easy/Medium/Hard), Topic (Arrays, Strings, Trees, etc.), Company (Google, Meta, Amazon, etc.), and Acceptance rate." },
        { q: "Can I track my progress?", a: "Yes! Your solved problems are tracked in your profile. View statistics on your Dashboard including: Problems solved by difficulty, Total problems solved, Recent activity, and Solved vs attempted." },
        { q: "How do test cases work?", a: "Each problem has multiple test cases. When you submit, we run your code against all test cases. Hidden test cases verify edge cases. You pass only if all cases pass." },
        { q: "Can I see hints?", a: "Yes, some problems include hints. Click the 'Hints' section below the problem description to reveal helpful hints. Use them when you're stuck!" },
        { q: "What happens after I submit?", a: "After submission: Your code runs against all test cases, Results show which passed/failed, Execution time and memory are measured, Your stats are updated, and You can view detailed results." },
      ]
    },
    "admin": {
      title: "Admin Panel",
      description: "Manage CompileHub with powerful admin tools.",
      items: [
        { q: "How do I access the admin panel?", a: "Navigate to /admin/login and enter your admin credentials. Only users with admin role can access the admin dashboard." },
        { q: "What is the Admin Dashboard?", a: "Admin Dashboard shows: Total users, Total codes, Total submissions, Recent activity, System stats, and Quick actions." },
        { q: "How do I manage users?", a: "In the Users section, you can: View all registered users, Search users by name/email, View user details, Delete users, and Update user status." },
        { q: "How do I view all codes?", a: "Codes section displays: All user-submitted code snippets, Filter by user, Filter by language, View code details, and Delete inappropriate code." },
        { q: "How do I view submissions?", a: "Submissions section shows: All problem submissions, Filter by problem, Filter by status (Accepted/Wrong Answer), View submitted code, and Rejudge submissions." },
        { q: "How do I manage problems?", a: "Problem Dashboard allows: Create new problems, Edit existing problems, Delete problems, Set difficulty, Add test cases, and Manage hints." },
        { q: "How do I create a new problem?", a: "Go to Create Problem: Enter problem title, description, difficulty, Add input/output examples, Set time/memory limits, Add test cases (public and hidden), and Publish problem." },
        { q: "How do I manage contacts?", a: "In Contacts section: View all contact form submissions, Mark messages as read, Reply to users via email, Delete messages, and Filter by status." },
        { q: "What are Admin Stats?", a: "Stats show: User growth over time, Code submission trends, Popular languages, Peak usage times, and System performance metrics." },
        { q: "How do I update admin profile?", a: "Go to Profile section: Update admin name, Change email, Change password, and Save settings." },
      ]
    },
    "troubleshooting": {
      title: "Troubleshooting",
      description: "Solutions to common issues you might encounter.",
      items: [
        { q: "Why is my code not running?", a: "Check these common issues: 1) Syntax errors in your code, 2) Wrong language selected, 3) Infinite loop (code running too long), 4) Network connection issues. Check the error message for specific guidance." },
        { q: "Why is the output empty?", a: "Your code might not produce output because: 1) No print statement included, 2) Print statement inside an unreachable code block, 3) Logic error preventing execution. Make sure to use the correct output function." },
        { q: "How do I fix infinite loops?", a: "If your code enters an infinite loop: Wait for timeout (usually 5 seconds), or click Stop to terminate. To prevent loops: Always verify while/for loop conditions, Add print statements to debug, and Test with small inputs first." },
        { q: "Why is execution taking too long?", a: "Possible causes: Complex algorithms with high time complexity, Nested loops, Recursive functions without proper base cases, Processing large inputs. Optimize your algorithm or simplify your approach." },
        { q: "Can I use external libraries?", a: "Currently, we support only standard library functions. External libraries or packages are not available. All code runs in a sandboxed environment for security." },
        { q: "Is there a code size limit?", a: "Yes, there's a reasonable limit on code size (approximately 50KB). For very large code, consider splitting into multiple snippets or downloading to work locally." },
        { q: "My session keeps logging out", a: "This might happen due to: Browser cookies being cleared, Session timeout after inactivity, Different browser/device used. Try: Clearing cache, Using incognito mode, Checking your internet connection." },
        { q: "How do I report a bug?", a: "Report bugs via: Email: support@compilehub.com, Include: Steps to reproduce, Expected vs actual behavior, Browser and version, Screenshots if possible." },
      ]
    },
    "security": {
      title: "Privacy & Security",
      description: "Your data security is our top priority.",
      items: [
        { q: "Is my code secure?", a: "Absolutely! Your code is stored in an encrypted database. We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Only you can access your code." },
        { q: "Who can see my code?", a: "Your code is 100% private. No other users, third parties, or advertisers can view your code snippets. Your data is never shared without your explicit consent." },
        { q: "Is my personal information secure?", a: "Yes! We never share your personal information with third parties. We don't sell data or show targeted ads. Our privacy policy clearly outlines how we protect your data." },
        { q: "Do you store my code?", a: "Yes, your code is securely stored so you can access it from any device. All stored code remains private and protected under our privacy policy." },
        { q: "Can I delete all my data?", a: "You can delete your account and all associated data at any time from Settings. Account deletion is permanent and removes all codes, statistics, and personal information." },
        { q: "How do you handle security vulnerabilities?", a: "We conduct regular security audits and penetration testing. Our security team promptly addresses any reported vulnerabilities. We follow OWASP guidelines for web application security." },
      ]
    },
    "contact": {
      title: "Contact Us",
      description: "We're here to help! Reach out through any of these channels.",
      contactMethods: [
        { icon: <FiMail className="w-6 h-6" />, title: "Email Support", value: "support@compilehub.com", desc: "For general inquiries and support" },
        { icon: <FiMessageCircle className="w-6 h-6" />, title: "Live Chat", value: "Available 24/7", desc: "Instant help from our team" },
        { icon: <FiTwitter className="w-6 h-6" />, title: "Twitter", value: "@CompileHub", desc: "Follow us for updates" },
        { icon: <FiGithub className="w-6 h-6" />, title: "GitHub", value: "github.com/compilehub", desc: "Report issues and contribute" },
      ]
    }
  };

  const colorClasses = {
    emerald: { bg: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", icon: "bg-emerald-500/20" },
    yellow: { bg: "from-yellow-500/20 to-yellow-500/5", border: "border-yellow-500/20", text: "text-yellow-400", icon: "bg-yellow-500/20" },
    blue: { bg: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", icon: "bg-blue-500/20" },
    purple: { bg: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", icon: "bg-purple-500/20" },
    cyan: { bg: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", icon: "bg-cyan-500/20" },
    pink: { bg: "from-pink-500/20 to-pink-500/5", border: "border-pink-500/20", text: "text-pink-400", icon: "bg-pink-500/20" },
    orange: { bg: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/20", text: "text-orange-400", icon: "bg-orange-500/20" },
    red: { bg: "from-red-500/20 to-red-500/5", border: "border-red-500/20", text: "text-red-400", icon: "bg-red-500/20" },
    green: { bg: "from-green-500/20 to-green-500/5", border: "border-green-500/20", text: "text-green-400", icon: "bg-green-500/20" },
    indigo: { bg: "from-indigo-500/20 to-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400", icon: "bg-indigo-500/20" },
  };

  const activeColor = colorClasses[sections.find(s => s.id === activeSection)?.color] || colorClasses.emerald;

  return (
    <div className="min-h-screen bg-[#0a0a14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <FiHelpCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">How can we help you?</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Find answers to common questions, learn how to use all features, and get the most out of CompileHub</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sticky top-20">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${colorClasses[section.color].bg} ${colorClasses[section.color].text} border ${colorClasses[section.color].border}`
                        : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Content Card */}
            <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${activeColor.icon}`}>
                  {sections.find(s => s.id === activeSection)?.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{content[activeSection]?.title}</h2>
                  <p className="text-gray-400 text-sm">{content[activeSection]?.description}</p>
                </div>
              </div>

              {/* Quick Start Steps */}
              {content[activeSection]?.steps && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {content[activeSection].steps.map((step) => (
                    <div key={step.step} className="bg-[#030712] border border-white/5 rounded-xl p-4 text-center hover:border-emerald-500/30 transition-all">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        {step.icon}
                      </div>
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                      <p className="text-gray-500 text-xs">{step.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Keyboard Shortcuts */}
              {content[activeSection]?.shortcuts && (
                <div className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content[activeSection].shortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between bg-[#030712] border border-white/5 rounded-xl p-3 hover:border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-gray-700 text-white text-xs font-mono rounded">{shortcut.key}</span>
                          <span className="text-gray-400 text-sm">{shortcut.action}</span>
                        </div>
                        <span className="text-gray-600 text-xs">{shortcut.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Methods */}
              {content[activeSection]?.contactMethods && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {content[activeSection].contactMethods.map((method, index) => (
                    <div key={index} className="bg-[#030712] border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{method.title}</h3>
                          <p className="text-emerald-400 text-sm">{method.value}</p>
                          <p className="text-gray-500 text-xs">{method.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Form */}
              {activeSection === "contact" && (
                <div className="mt-6">
                  <ContactForm />
                </div>
              )}

              {/* FAQ Items */}
              {content[activeSection]?.items && (
                <div className="space-y-3 mt-6">
                  {content[activeSection].items.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-[#030712] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all"
                    >
                      <button
                        onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-white font-medium pr-4">{item.q}</span>
                        <span className={`text-gray-500 transition-transform ${expandedItem === index ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </button>
                      {expandedItem === index && (
                        <div className="px-5 pb-4">
                          <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
