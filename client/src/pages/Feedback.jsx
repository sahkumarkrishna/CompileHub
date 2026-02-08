const testimonials = [
  {
    name: "Aman Gupta",
    gender: "Male",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "CompileHub made coding so much easier! No installations, just code and run instantly.",
    rating: 5,
  },
  {
    name: "Rohit Kumar",
    gender: "Male",
    img: "https://randomuser.me/api/portraits/men/41.jpg",
    text: "Great platform, but I'd love to see more languages supported in the future.",
    rating: 4,
  },
  {
    name: "Meena Patel",
    gender: "Female",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "I love the real-time preview feature. It feels like coding on a professional IDE.",
    rating: 5,
  },
  {
    name: "Aarav Singh",
    gender: "Male",
    img: "https://randomuser.me/api/portraits/men/57.jpg",
    text: "Super smooth experience. Perfect for quick testing and practicing algorithms.",
    rating: 4,
  },
  {
    name: "Priya Verma",
    gender: "Female",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Great for beginners. The autocompletion saves a lot of time while learning.",
    rating: 4,
  },
  {
    name: "Karan Mehta",
    gender: "Male",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "Found it very useful for my college projects. Easy to use and fast.",
    rating: 5,
  },
];

export default function FeedbackSection() {
  return (
    <section className="py-20 px-4 sm:px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-5xl sm:text-6xl font-black gradient-text mb-6">
            What Users Say
          </h2>
          <p className="text-gray-400 text-xl">Trusted by thousands of developers worldwide</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card group hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-emerald-500/30 group-hover:border-emerald-500/50 transition-all"
                />
                <div>
                  <h3 className="font-bold text-white text-lg">{t.name}</h3>
                  <p className="text-gray-400 text-sm">{t.gender}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">{t.text}</p>

              <div className="flex text-yellow-400 text-xl">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx}>
                    {idx < t.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
