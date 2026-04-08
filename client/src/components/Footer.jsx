import { Link } from "react-router-dom";
import { FiCode, FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Demo", path: "/compileCode" },
      { label: "History", path: "/history" },
    ],
    resources: [
      { label: "Watch Demo", path: "/watchDemo" },
      { label: "Get Started", path: "/login" },
    ],
    company: [
      { label: "About", path: "/" },
      { label: "Contact", path: "mailto:support@compilehub.com" },
    ],
    legal: [
      { label: "Privacy", path: "#" },
      { label: "Terms", path: "#" },
    ],
  };

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <FiCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CompileHub</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              The most powerful online code compiler. Write, run, and share code in 50+ programming languages.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="mailto:support@compilehub.com" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  {link.path.startsWith('mailto:') ? (
                    <a href={link.path} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.path} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 text-sm">
            {footerLinks.legal.map((link, i) => (
              <a key={i} href={link.path} className="text-gray-500 hover:text-emerald-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            © {currentYear} CompileHub. Made with <FiHeart className="w-4 h-4 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;