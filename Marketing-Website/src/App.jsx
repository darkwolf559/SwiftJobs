import React, { useState, useEffect } from 'react';
import {
  ChevronRight, Users, Search, Calendar, MessageSquare, Bell, CheckCircle,
  Building, Menu, X, ArrowUp, Star, Mail, Phone, MapPin, Github, Linkedin, Twitter
} from 'lucide-react';

const SwiftJobsLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Data definitions (unchanged for brevity)
  const features = [
    { icon: <Search className="w-8 h-8" />, title: "Smart Job Matching", description: "AI-powered job recommendations based on your skills and preferences" },
    { icon: <Bell className="w-8 h-8" />, title: "Real-time Alerts", description: "Instant notifications for new matching positions" },
    { icon: <MessageSquare className="w-8 h-8" />, title: "Intelligent Chat", description: "AI-assisted communication with employers" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "Application Tracking", description: "Real-time status updates on your applications" },
    { icon: <Calendar className="w-8 h-8" />, title: "Smart Scheduling", description: "AI-powered interview scheduling assistant" },
    { icon: <Users className="w-8 h-8" />, title: "Team Collaboration", description: "Seamless hiring team coordination" }
  ];

  const stats = [
    { value: "Pending..", label: "Active Users" },
    { value: "Pending..", label: "Companies" },
    { value: "Pending..", label: "Success Rate" },
    { value: "Pending..", label: "Support" }
  ];

  const testimonials = [
    { name: "John Steven", role: "Software Engineer at TechCorp", image: "836.jpg", text: "SwiftJobs' AI matching algorithm found me my dream role in just 2 weeks. The process was seamless and efficient.", rating: 5 },
    { name: "Mark Chen", role: "HR Manager at StartupX", image: "836.jpg", text: "As an employer, the AI-powered candidate matching has saved us countless hours in recruitment. Highly recommended!", rating: 5 },
    { name: "Lisa Parker", role: "UX Designer at DesignLab", image: "836.jpg", text: "The platform's interface is intuitive and the job recommendations are spot-on. Found my new position in no time!", rating: 5 },
    
  ];

  const teamMembers = [
    { name: "Gavishka Katugampala", role: "Team Leader", image: "gavishka.jpg", bio: "Gavishka leads the SDGP team with a passion for using technology to drive positive change in education. Skilled in both frontend and backend development, he ensures seamless integration across the platform while fostering a collaborative and innovative environment within the team." },
    { name: "Radun Senula", role: "Frontend", image: "radun1.jpg", bio: "Radun brings creativity and a keen eye for design to the SDGP project. They focus on crafting user interfaces that are visually engaging and easy to navigate, enhancing the overall user experience of the platform." },
    { name: "Pasan Pramuditha", role: "Lead Developer", image: "pasan.jpg", bio: "Pasan is the Lead Developer, bringing strong technical expertise and problem-solving skills to the project. They specialize in creating efficient, scalable solutions and ensure that the project’s technical architecture is robust and performs seamlessly across all systems." },
    { name: "Chenath Karunasena", role: "Backend", image: "chenath.jpg", bio: "Chenath handles the backend development with expertise in server-side technologies. They focus on building a secure, scalable, and efficient infrastructure to support the platform’s functionality." },
    { name: "Rusitha Navod", role: "Backend", image: "rusitha1.jpg", bio: "Rusitha ensures the backend systems of the platform are optimized for performance and reliability. Their knowledge of databases and API integration helps ensure that the platform runs efficiently and securely." },
    { name: "Pehan Janu", role: "Frontend", image: "pehan.jpg", bio: "Pehan is a detail-oriented frontend developer who specializes in building clean, responsive, and user-friendly interfaces. Their work ensures that the platform delivers a smooth experience across different devices and screen sizes." }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      /* Navigation */
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-purple-600' : 'text-purple-500'}`}>
              SwiftJobs
            </span>
            <div className="hidden md:flex items-center space-x-6">
              {["Home", "Features", "Testimonials", "Team"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-600 hover:text-purple-600 transition-colors duration-300">
                  {item}
                </a>
              ))}
            </div>
            <button
              className="md:hidden p-4 text-gray-600 hover:text-purple-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-64 mt-4' : 'max-h-0'}`}>
            <div className="flex flex-col space-y-4 py-4">
              {["Home", "Features", "Testimonials", "Team"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-purple-600 transition-colors text-center text-lg py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      
<section className="pt-32 sm:pt-48 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white" id="home">
  <div className="container mx-auto flex flex-col items-center md:flex-row md:items-center md:justify-between space-y-8 md:space-y-0 md:space-x-8">
    <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Find Your Dream Job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">AI-Powered</span> Precision
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
        SwiftJobs connects you with the best opportunities using AI-driven job matching and real-time updates.
      </p>
    </div>
    <div className="w-full md:w-1/2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl transform rotate-6 scale-105 opacity-20"></div>
        <div className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-purple-50 rounded-xl">
              <Search className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600" />
              <div className="flex-1">
                <div className="h-3 sm:h-4 bg-purple-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-900 text-white">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl sm:text-3xl font-bold mb-2">{stat.value}</div>
          <div className="text-purple-200 text-lg">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" id="features">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50" id="testimonials">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" loading="lazy" />
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


{/*team section*/}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white transition-colors duration-300 hover:bg-opacity-95" id="team">
  <div className="container mx-auto">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-bounceIn transition-colors duration-300 hover:text-gray-800">Meet Our Team</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <div
          key={index}
          className="text-center border-2 border-purple-200 rounded-xl p-4 shadow-md transition-all duration-300 transform hover:scale-105 hover:translate-y-[-5px] hover:shadow-lg"
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-32 h-32 mx-auto object-contain rounded-full mb-6 transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-purple-600">{member.name}</h3>
          <p className="text-purple-600 mb-4 transition-colors duration-300 hover:text-purple-800">{member.role}</p>
          <p className="text-gray-600 text-sm transition-opacity duration-300 hover:opacity-90">{member.bio}</p>
        </div>
      ))}
    </div>
  </div>
</section>
   

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <span className="text-2xl font-bold text-purple-400">SwiftJobs</span>
              <p className="text-gray-400 leading-relaxed">
                AI-powered job matching platform revolutionizing the way people find their dream careers.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-purple-400" />
                  <p className="text-gray-400">swiftjobs@gmail.com</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-purple-400" />
                  <p className="text-gray-400">+94 (077) 777-7777</p>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-purple-400" />
                  <p className="text-gray-400">Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-semibold">Connect</h4>
              <div className="flex space-x-6">
                {[Github, Linkedin, Twitter].map((Icon, index) => (
                  <a key={index} href="#" className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 mb-4">© 2025 SwiftJobs. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-purple-700 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SwiftJobsLanding;