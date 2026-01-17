import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Sparkles,
  Award,
  Code,
  Zap,
  Globe,
  Star,
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  Image,
  Lock
} from "lucide-react";
import Admin from "./pages/Admin";
import BlurText from "./components/BlurText";
import CounterAnimation from "./components/CounterAnimation";
import SplashCursor from "./components/SplashCursor";

const API_BASE = "http://localhost:5000/api";

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("portfolio_token"));
  const [skills, setSkills] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const startAutoScroll = async () => {
    setIsScrolling(true);
    const sectionTimings = [
      { id: 'hero', elementId: 'nav', duration: 1000, label: 'Welcome' },
      { id: 'projects', elementId: 'projects', duration: 2000, label: 'Projects' },
      { id: 'skills', elementId: 'skills', duration: 2000, label: 'Skills' },
      { id: 'certifications', elementId: 'certifications', duration: 2000, label: 'Certifications' },
      { id: 'achievements', elementId: 'achievements', duration: 2000, label: 'Achievements' },
      { id: 'contact', elementId: 'contact', duration: 2000, label: 'Contact' }
    ];
    
    for (const section of sectionTimings) {
      const element = document.getElementById(section.elementId);
      if (element) {
        await new Promise(resolve => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(resolve, section.duration);
        });
      }
    }
    setIsScrolling(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c, p, a] = await Promise.all([
          fetch(`${API_BASE}/skills`),
          fetch(`${API_BASE}/certifications`),
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/achievements`)
        ]);

        setSkills(await s.json());
        setCertifications(await c.json());
        setProjects(await p.json());
        setAchievements(await a.json());
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const move = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="text-white" size={48} />
        </motion.div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
    {/* Global Splash Cursor Background */}
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas id="canvas" style={{ display: 'block', width: '100%', height: '100%' }} />
      <SplashCursor />
    </div>

    {/* Content */}
    <div className="relative z-10">
    {isAdmin ? (
      <Admin 
        token={token} 
        setToken={setToken} 
        onLogout={() => {
          setIsAdmin(false);
          // Refresh data when exiting admin
          const fetchData = async () => {
            try {
              const [s, c, p, a] = await Promise.all([
                fetch(`${API_BASE}/skills`),
                fetch(`${API_BASE}/certifications`),
                fetch(`${API_BASE}/projects`),
                fetch(`${API_BASE}/achievements`)
              ]);
              setSkills(await s.json());
              setCertifications(await c.json());
              setProjects(await p.json());
              setAchievements(await a.json());
            } catch (err) {
              console.error("API error:", err);
            }
          };
          fetchData();
        }}
        onClose={() => {
          setIsAdmin(false);
          // Refresh data when exiting admin
          const fetchData = async () => {
            try {
              const [s, c, p, a] = await Promise.all([
                fetch(`${API_BASE}/skills`),
                fetch(`${API_BASE}/certifications`),
                fetch(`${API_BASE}/projects`),
                fetch(`${API_BASE}/achievements`)
              ]);
              setSkills(await s.json());
              setCertifications(await c.json());
              setProjects(await p.json());
              setAchievements(await a.json());
            } catch (err) {
              console.error("API error:", err);
            }
          };
          fetchData();
        }}
      />
    ) : (
    <>
    {/* Professional Navbar */}
    <nav className="fixed top-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg flex items-center justify-center">
            <Code size={24} className="text-slate-900 font-bold" />
          </div>
          <h1 className="text-2xl font-black text-slate-100">
            Durvesh
          </h1>
        </motion.div>
        <div className="flex items-center gap-6">
          <motion.a
            href="#contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ 
              scale: 1.08,
              backgroundColor: 'rgb(0, 0, 0)',
              borderColor: 'rgb(0, 0, 0)',
              boxShadow: '0 0 20px rgba(100,200,255, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            className="relative group flex items-center gap-2 px-5 py-2 rounded-lg bg-black/80 border border-slate-600/80 hover:border-cyan-400 transition-all duration-300 overflow-hidden"
          >
            <motion.span
              whileHover={{ rotate: 15 }}
              className="relative z-10"
            >
              <Mail size={18} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
            </motion.span>
            <span className="relative z-10 font-semibold text-slate-100 group-hover:text-white transition-colors">
              Contact
            </span>
          </motion.a>

          <motion.button
            onClick={() => setIsAdmin(!isAdmin)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ 
              scale: 1.08,
              backgroundColor: 'rgba(20, 20, 20, 1)',
              borderColor: 'rgba(100, 200, 255, 0.8)',
              boxShadow: '0 0 25px rgba(100,200,255, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            className="relative group flex items-center gap-2 px-6 py-2 rounded-lg bg-black/90 border border-slate-600/80 transition-all duration-300 overflow-hidden font-semibold"
          >
            <motion.span
              whileHover={{ y: -3 }}
              className="relative z-10"
            >
              {isAdmin ? <Code size={18} className="text-slate-300 group-hover:text-cyan-400 transition-colors" /> : <Lock size={18} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />}
            </motion.span>
            <span className="relative z-10 text-slate-100 group-hover:text-white transition-colors">
              {isAdmin ? "Exit" : "Admin"}
            </span>
          </motion.button>
        </div>
      </div>
    </nav>

    {/* Page content */}
    {/* Professional Hero Section */}
<section className="pt-24 px-4 md:px-8 pb-20 relative overflow-hidden">
  {/* Animated background blobs */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <motion.div
      animate={{ 
        x: [0, 50, 0],
        y: [0, 50, 0]
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-40 -left-40 w-80 h-80 bg-slate-800/20 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ 
        x: [0, -50, 0],
        y: [0, -50, 0]
      }}
      transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-40 -right-40 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl"
    />
  </div>

  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <motion.span
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: ['0 0 0px rgba(100,200,255,0.3)', '0 0 20px rgba(100,200,255,0.6)', '0 0 0px rgba(100,200,255,0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-300 inline-block"
          >
            👋 Welcome to my portfolio
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <BlurText
            text="Full Stack Developer"
            delay={150}
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            animateBy="words"
            direction="top"
            stepDuration={0.4}
          />
        </motion.div>

        <BlurText
          text="I craft beautiful, scalable web applications with cutting-edge technologies. Passionate about clean code and exceptional user experiences."
          delay={80}
          className="text-xl text-slate-400 mb-8 leading-relaxed"
          animateBy="words"
          direction="top"
          stepDuration={0.3}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <motion.button
            onClick={startAutoScroll}
            disabled={isScrolling}
            whileHover={{ x: 5, boxShadow: '0 0 30px rgba(100,200,255,0.6)' }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg btn-hover font-semibold text-lg flex items-center gap-2 transition-all"
          >
            {isScrolling ? 'Exploring...' : "Let's Explore"}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight size={20} />
            </motion.span>
          </motion.button>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-slate-600 hover:border-slate-500 rounded-lg btn-hover font-semibold text-lg flex items-center gap-2 transition-all"
          >
            <Mail size={20} />
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.1, y: -5 }}
            className="cursor-default"
          >
            <CounterAnimation value={3} duration={2} />
            <p className="text-slate-500 text-sm">Projects Done</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1, y: -5 }}
            className="cursor-default"
          >
            <CounterAnimation value={6}  duration={2} />
            <p className="text-slate-500 text-sm">Technologies</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side - Profile Image */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative h-full min-h-96 flex items-center justify-center"
      >
        <div className="relative w-full h-full max-w-md mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl">
          <img 
            src="/Gemini_Generated_Image_4vrdju4vrdju4vrd.png"
            alt="Durvesh Madvi"
            className="w-full h-full object-cover filter drop-shadow-lg blend-multiply opacity-95"
          />
          {/* Blend overlay for better integration */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  </div>
</section>

{/* Projects Section */}
<section id="projects" className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <BlurText
        text="Featured Projects"
        delay={100}
        className="text-5xl md:text-6xl font-black mb-4 text-slate-100"
        animateBy="words"
        direction="top"
        stepDuration={0.4}
      />
      <BlurText
        text="Showcasing my best work and technical expertise"
        delay={60}
        className="text-xl text-slate-400"
        animateBy="words"
        direction="top"
        stepDuration={0.2}
      />
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50, rotateX: 40 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.08,
            rotateZ: 2,
            boxShadow: '0 0 40px rgba(100,200,255,0.5)'
          }}
          className="group rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 card-hover transition-all perspective"
        >
          {/* Animated shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Project Image Area */}
          <div className="h-56 bg-slate-800/50 relative overflow-hidden">
          </div>

          <div className="p-8 relative z-10">
            <motion.h3
              whileHover={{ x: 5 }}
              className="text-2xl font-bold mb-3 text-slate-100"
            >
              {project.name}
            </motion.h3>

            <p className="text-slate-400 mb-6">
              {project.description}
            </p>

            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.15 + 0.3 }}
            >
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    scale: 1.25,
                    rotate: 10,
                    boxShadow: '0 0 20px rgba(100,200,255,0.6)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-600"
                >
                  <Github size={20} />
                </motion.a>
              )}

              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    scale: 1.25,
                    rotate: -10,
                    boxShadow: '0 0 20px rgba(100,200,255,0.6)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-600"
                >
                  <ExternalLink size={20} />
                </motion.a>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Skills Section */}
<section id="skills" className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <BlurText
        text="Technical Skills"
        delay={100}
        className="text-5xl md:text-6xl font-black mb-4 text-slate-100"
        animateBy="words"
        direction="top"
        stepDuration={0.4}
      />
      <BlurText
        text="Expertise across modern web technologies"
        delay={60}
        className="text-xl text-slate-400"
        animateBy="words"
        direction="top"
        stepDuration={0.2}
      />
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Object.entries(skills).map(([category, skillsList], index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.12 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.05,
            y: -10,
            boxShadow: '0 0 40px rgba(100,200,255,0.4)'
          }}
          className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 card-hover p-8 transition-all relative group"
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-blue-500 to-slate-900"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <motion.div
            whileHover={{ rotate: 10 }}
            className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center mb-6 relative z-10"
          >
            <Zap size={24} className="text-slate-300" />
          </motion.div>

          <motion.h3
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            className="text-xl font-bold mb-6 text-slate-100 relative z-10"
          >
            {category}
          </motion.h3>

          <div className="flex flex-wrap gap-2 relative z-10">
            {Array.isArray(skillsList) ? (
              skillsList.map((skill, idx) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.12 + idx * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.15,
                    y: -5,
                    boxShadow: '0 0 15px rgba(100,200,255,0.5)',
                    backgroundColor: 'rgba(100,180,255,0.3)'
                  }}
                  animate={{ 
                    rotate: [0, 2, -2, 0]
                  }}
                  className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-full text-sm font-semibold text-slate-300 transition-all duration-300 cursor-default"
                >
                  {skill}
                </motion.span>
              ))
            ) : (
              <span className="text-slate-500">No skills listed</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Certifications Section */}
<section id="certifications" className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <BlurText
        text="Certifications"
        delay={100}
        className="text-5xl md:text-6xl font-black mb-4 text-slate-100"
        animateBy="words"
        direction="top"
        stepDuration={0.4}
      />
      <BlurText
        text="Verified credentials and professional achievements"
        delay={60}
        className="text-xl text-slate-400"
        animateBy="words"
        direction="top"
        stepDuration={0.2}
      />
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {certifications.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, x: -50, rotateY: 40 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 40px rgba(100,200,255,0.5)',
            rotateZ: 1
          }}
          className="group rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 card-hover p-8 transition-all relative"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-blue-500 to-slate-900"
            animate={{ 
              x: ['0%', '100%', '0%']
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="flex items-start gap-6 relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0"
            >
              <Star size={32} className="text-slate-300" />
            </motion.div>

            <div className="flex-1">
              <motion.h3
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl font-bold mb-2 text-slate-100"
              >
                {cert.name}
              </motion.h3>
              <motion.p
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-lg text-slate-400 font-semibold mb-3"
              >
                {cert.issuer}
              </motion.p>
              <motion.p
                whileHover={{ x: 5 }}
                className="text-sm text-slate-500 flex items-center gap-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-slate-400 rounded-full"
                />
                {new Date(cert.date).toLocaleDateString()}
              </motion.p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
{/* Achievements Section */}
<section id="achievements" className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <BlurText
        text="Achievements"
        delay={100}
        className="text-5xl md:text-6xl font-black mb-4 text-slate-100"
        animateBy="words"
        direction="top"
        stepDuration={0.4}
      />
      <BlurText
        text="Milestones and accomplishments in my career"
        delay={60}
        className="text-xl text-slate-400"
        animateBy="words"
        direction="top"
        stepDuration={0.2}
      />
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 40, rotateX: 30 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, delay: index * 0.15 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.05,
            y: -5,
            boxShadow: '0 0 50px rgba(100,200,255,0.6)',
            rotateZ: -1
          }}
          className="group rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 card-hover p-8 transition-all relative"
        >
          {/* Pulsing background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-25 bg-gradient-to-br from-blue-500 via-slate-900 to-slate-900"
            animate={{ 
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="flex items-start gap-6 relative z-10">
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0"
            >
              <TrendingUp size={32} className="text-slate-300" />
            </motion.div>

            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.2 }}
                className="text-2xl font-bold mb-3 text-slate-100"
              >
                {achievement.title}
              </motion.h3>
              <motion.p
                animate={{ 
                  color: ['#cbd5e1', '#e2e8f0', '#cbd5e1']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-slate-400 text-lg mb-4"
              >
                {achievement.description}
              </motion.p>
              <motion.p
                whileHover={{ x: 5 }}
                className="text-sm text-slate-500 flex items-center gap-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                  className="w-2 h-2 bg-slate-400 rounded-full"
                />
                {new Date(achievement.date).toLocaleDateString()}
              </motion.p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
{/* Contact Section */}
<section id="contact" className="py-32 px-4 md:px-8 relative overflow-hidden">
  {/* Animated background */}
  <motion.div
    className="absolute inset-0 -z-10"
    animate={{ 
      background: [
        'radial-gradient(600px at 100px 50px, #000000 0%, transparent 80%)',
        'radial-gradient(600px at 400px 200px, #000000 0%, transparent 80%)',
        'radial-gradient(600px at 100px 50px, #000000 0%, transparent 80%)'
      ]
    }}
    transition={{ duration: 10, repeat: Infinity }}
  />

  <div className="max-w-4xl mx-auto text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <BlurText
        text="Let's Work Together"
        delay={100}
        className="text-5xl md:text-6xl font-black mb-6 text-slate-100"
        animateBy="words"
        direction="top"
        stepDuration={0.4}
      />
      <BlurText
        text="I'm always interested in hearing about new projects and opportunities."
        delay={60}
        className="text-xl text-slate-400 mb-12"
        animateBy="words"
        direction="top"
        stepDuration={0.2}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
        {[
          { icon: Mail, title: 'Email', value: 'durvesh5.madvi@gmail.com', href: 'mailto:durvesh5.madvi@gmail.com', delay: 0 },
          { icon: Github, title: 'GitHub', value: 'DurveshMadvi', href: 'https://github.com/DurveshMadvi', delay: 0.1 },
          { icon: Linkedin, title: 'LinkedIn', value: 'Durvesh Madvi', href: 'https://www.linkedin.com/in/durvesh-madvi-40222528b/', delay: 0.2 }
        ].map((contact, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: contact.delay }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.08,
              y: -10,
              boxShadow: '0 0 40px rgba(100,200,255,0.5)'
            }}
            className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-8 hover:bg-slate-800/60 transition-all card-hover relative group overflow-hidden"
          >
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 bg-gradient-to-br from-blue-500 to-transparent"
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              <contact.icon size={40} className="text-slate-300 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-bold text-slate-100 mb-2 relative z-10">
              {contact.title}
            </h3>
            <a href={contact.href} target={contact.href.startsWith('http') ? "_blank" : undefined} rel={contact.href.startsWith('http') ? "noopener noreferrer" : undefined} className="text-slate-400 hover:text-slate-200 transition-colors break-all relative z-10">
              <motion.span
                whileHover={{ x: 3 }}
              >
                {contact.value}
              </motion.span>
            </a>
          </motion.div>
        ))}
      </div>

      <motion.a
        href="/Durvesh_CV.pdf"
        download="Durvesh_Madvi_CV.pdf"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        viewport={{ once: true }}
        whileHover={{ 
          scale: 1.12,
          boxShadow: '0 0 60px rgba(100,200,255,0.8), 0 0 30px rgba(59,130,246,0.6)',
          y: -5
        }}
        whileTap={{ scale: 0.95 }}
        className="relative inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-bold overflow-hidden group rounded-xl transition-all duration-300"
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Animated glow layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Pulsing border effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-cyan-300/50"
          animate={{ 
            boxShadow: ['0 0 0px rgba(34,211,238,0.3)', '0 0 20px rgba(34,211,238,0.6)', '0 0 0px rgba(34,211,238,0.3)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 flex items-center justify-center gap-3"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📄
          </motion.span>
          <span className="text-white font-bold">Download My CV</span>
          <motion.svg
            className="w-5 h-5 text-white"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </motion.svg>
        </motion.div>
      </motion.a>
    </motion.div>
  </div>
</section>

{/* Footer */}
<footer className="py-12 px-4 md:px-8">
  <div className="max-w-7xl mx-auto text-center">
    <p className="text-slate-500 mb-4">
       {new Date().getFullYear()} Durvesh Madvi
    </p>
    
  </div>
</footer>

    </>
    )}
    </div>
  </div>
);
}

export default App;
