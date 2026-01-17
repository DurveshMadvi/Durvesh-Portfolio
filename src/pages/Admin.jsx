import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, LogOut, Plus, Trash2, Eye, EyeOff, Lock } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const Admin = ({ token, setToken, onLogout, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('skills');
  
  // Data states
  const [skills, setSkills] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  // Form states
  const [newSkill, setNewSkill] = useState({ category: 'languages', skill: '' });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', category: '', date: '', image: '' });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: '',
    type: 'Full Stack',
    github: '',
    live: ''
  });
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', date: new Date().getFullYear().toString(), icon: '' });

  // Fetch data when logged in and check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('portfolio_token');
    if (storedToken && !token) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchAllData();
    }
  }, [isLoggedIn, token]);

  const fetchAllData = async () => {
    try {
      const [skillsRes, certsRes, projRes, achRes] = await Promise.all([
        fetch(`${API_BASE}/skills`),
        fetch(`${API_BASE}/certifications`),
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/achievements`)
      ]);

      const skillsData = await skillsRes.json();
      const certsData = await certsRes.json();
      const projData = await projRes.json();
      const achData = await achRes.json();

      setSkills(skillsData);
      setCertifications(certsData);
      setProjects(projData);
      setAchievements(achData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('portfolio_token', data.token);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        setError('');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    }

    setLoading(false);
  };

  const handleAddSkill = async () => {
    if (!newSkill.skill) return;

    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });

      if (res.ok) {
        const updatedSkills = { ...skills };
        if (!updatedSkills[newSkill.category]) {
          updatedSkills[newSkill.category] = [];
        }
        updatedSkills[newSkill.category].push(newSkill.skill);
        setSkills(updatedSkills);
        setNewSkill({ category: 'languages', skill: '' });
      }
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  const handleDeleteSkill = async (category, skill) => {
    try {
      // Find the index of the skill in the category array
      const index = skills[category].indexOf(skill);
      if (index === -1) return;

      const res = await fetch(`${API_BASE}/skills/${category}/${index}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const updatedSkills = { ...skills };
        updatedSkills[category] = updatedSkills[category].filter(s => s !== skill);
        setSkills(updatedSkills);
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const handleAddCertification = async () => {
    if (!newCert.title || !newCert.issuer) return;

    try {
      const res = await fetch(`${API_BASE}/certifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCert)
      });

      if (res.ok) {
        const data = await res.json();
        setCertifications([...certifications, data.certification || data]);
        setNewCert({ title: '', issuer: '', category: '', date: '', image: '' });
      }
    } catch (err) {
      console.error('Error adding certification:', err);
    }
  };

  const handleDeleteCertification = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/certifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setCertifications(certifications.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting certification:', err);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.name || !newProject.description) return;

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProject,
          technologies: newProject.technologies.split(',').map(t => t.trim())
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProjects([...projects, data.project || data]);
        setNewProject({ name: '', description: '', technologies: '', type: 'Full Stack', github: '', live: '' });
      }
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.description) return;

    try {
      const res = await fetch(`${API_BASE}/achievements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAchievement)
      });

      if (res.ok) {
        const data = await res.json();
        setAchievements([...achievements, data.achievement || data]);
        setNewAchievement({ title: '', description: '', date: new Date().getFullYear().toString(), icon: '' });
      }
    } catch (err) {
      console.error('Error adding achievement:', err);
    }
  };

  const handleDeleteAchievement = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/achievements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setAchievements(achievements.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Error deleting achievement:', err);
    }
  };

  const handleLogoutAdmin = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('portfolio_token');
    onLogout();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 bg-orange-600/10 rounded-full blur-3xl bottom-20 right-20"></div>
          </div>

          <div className="relative z-10 bg-gray-900/80 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Lock className="text-white" size={32} />
                <h1 className="text-3xl font-bold text-white">Admin Access</h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-stone-50/50 border border-gray-700/50 text-white placeholder-stone-600 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all"
                  placeholder="admin@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-stone-50/50 border border-gray-700/50 text-white placeholder-stone-600 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-600/50 disabled:opacity-50 transition-all"
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>

            
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-900/80 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Portfolio Manager
          </h1>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-700 text-white hover:border-stone-500 hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Back to Portfolio
            </motion.button>
            <motion.button
              onClick={handleLogoutAdmin}
              className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <LogOut size={18} /> Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-16 z-10 bg-gray-900/50 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {['skills', 'certifications', 'projects', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold text-lg border-b-2 transition-all capitalize ${
                activeTab === tab
                  ? 'border-amber-700 text-white'
                  : 'border-transparent text-stone-600 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="text-cyan-400" size={28} /> Add New Skill
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="languages">Languages</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="databases">Databases</option>
                </select>
                <input
                  type="text"
                  value={newSkill.skill}
                  onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                  placeholder="Skill name"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <motion.button
                  onClick={handleAddSkill}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-lg bg-cyan-400 text-slate-900 font-bold hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  Add Skill
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-slate-100 mb-4 capitalize">
                    {category.replace(/([A-Z])/g, ' $1')}
                  </h4>
                  <div className="space-y-2">
                    {skillList.map((skill, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-slate-300">{skill}</span>
                        <motion.button
                          onClick={() => handleDeleteSkill(category, skill)}
                          whileHover={{ scale: 1.1 }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Plus className="text-cyan-400" size={28} /> Add New Certification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="Title"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  placeholder="Issuer"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={newCert.category}
                  onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                  placeholder="Category"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={newCert.image}
                  onChange={(e) => setNewCert({ ...newCert, image: e.target.value })}
                  placeholder="Emoji/Icon"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="date"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:outline-none focus:border-cyan-400 md:col-span-1 lg:col-span-1"
                />
                <motion.button
                  onClick={handleAddCertification}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-lg bg-cyan-400 text-slate-900 font-bold hover:shadow-lg hover:shadow-cyan-500/50 md:col-span-1"
                >
                  Add Cert
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <motion.div
                  key={cert.id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">{cert.image}</span>
                    <motion.button
                      onClick={() => handleDeleteCertification(cert.id)}
                      whileHover={{ scale: 1.1 }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                  <h4 className="font-bold text-slate-100 mb-1">{cert.title}</h4>
                  <p className="text-sm text-slate-400">{cert.issuer}</p>
                  {cert.date && <p className="text-xs text-slate-500 mt-2 font-mono">{cert.date}</p>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Plus className="text-cyan-400" size={28} /> Add New Project
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Project Name"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <select
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Mobile">Mobile</option>
                </select>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Description"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 md:col-span-2"
                  rows="3"
                />
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  placeholder="Technologies (comma separated)"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 md:col-span-2"
                />
                <input
                  type="url"
                  value={newProject.github}
                  onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  placeholder="GitHub Link (optional)"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="url"
                  value={newProject.live}
                  onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                  placeholder="Live Link (optional)"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <motion.button
                  onClick={handleAddProject}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-lg bg-cyan-400 text-slate-900 font-bold hover:shadow-lg hover:shadow-cyan-500/50 md:col-span-2"
                >
                  Add Project
                </motion.button>
              </div>
            </div>

            <div className="space-y-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-slate-100">{project.name}</h4>
                      <p className="text-sm text-cyan-400 font-mono">{project.type}</p>
                    </div>
                    <motion.button
                      onClick={() => handleDeleteProject(project.id)}
                      whileHover={{ scale: 1.1 }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={24} />
                    </motion.button>
                  </div>
                  <p className="text-slate-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.github !== '#' && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">GitHub â†’</a>}
                    {project.live !== '#' && <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">Live â†’</a>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Plus className="text-cyan-400" size={28} /> Add New Achievement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="Achievement Title"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 md:col-span-2"
                />
                <textarea
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Description"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 md:col-span-2"
                  rows="2"
                />
                <input
                  type="text"
                  value={newAchievement.icon}
                  onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })}
                  placeholder="Icon/Emoji (e.g., ðŸ†)"
                  maxLength="2"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                  placeholder="Year"
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <motion.button
                  onClick={handleAddAchievement}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-lg bg-cyan-400 text-slate-900 font-bold hover:shadow-lg hover:shadow-cyan-500/50 md:col-span-2"
                >
                  Add Achievement
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 group"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">{achievement.icon}</span>
                    <motion.button
                      onClick={() => handleDeleteAchievement(achievement.id)}
                      whileHover={{ scale: 1.1 }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                  <h4 className="font-bold text-slate-100 mb-2">{achievement.title}</h4>
                  <p className="text-sm text-slate-400 mb-3">{achievement.description}</p>
                  {achievement.date && <p className="text-xs text-slate-500 font-mono">Year: {achievement.date}</p>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;

