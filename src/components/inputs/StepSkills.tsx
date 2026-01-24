import { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import type { Skill, SkillLevel, SkillCategory } from '../../types/retirement';
import { Plus, X, Briefcase, Sparkles, Code, Users, Palette, Wrench, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cosmic-500/50 focus:border-cosmic-500 transition-all duration-200";
const selectClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500/50 focus:border-cosmic-500 transition-all duration-200 appearance-none cursor-pointer";

const categoryIcons: Record<SkillCategory, typeof Code> = {
    Tech: Code,
    Management: Users,
    Creative: Palette,
    Manual: Wrench,
    Other: MoreHorizontal
};

const levelColors: Record<SkillLevel, string> = {
    Beginner: 'text-slate-400 bg-slate-400/10',
    Intermediate: 'text-cyan-400 bg-cyan-400/10',
    Advanced: 'text-cosmic-400 bg-cosmic-400/10'
};

const StepSkills = () => {
    const { profile, updateProfile } = useProfile();
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
    const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Tech');

    const addSkill = () => {
        if (!newSkillName.trim()) return;
        const newSkill: Skill = {
            id: Date.now().toString(),
            name: newSkillName,
            level: newSkillLevel,
            category: newSkillCategory,
        };
        updateProfile({ skills: [...profile.skills, newSkill] });
        setNewSkillName('');
    };

    const removeSkill = (id: string) => {
        updateProfile({ skills: profile.skills.filter(s => s.id !== id) });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Add Skills Card */}
            <div className="bg-gradient-to-br from-cosmic-500/10 to-cyan-400/5 p-6 rounded-2xl border border-cosmic-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cosmic-400" /> Add Your Skills
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                    Skills can boost your earning potential and unlock faster paths to retirement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Skill Name</label>
                        <input
                            type="text"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="e.g. React, Project Management"
                            className={inputClasses}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Level</label>
                        <div className="relative">
                            <select
                                value={newSkillLevel}
                                onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                                className={selectClasses}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                        <div className="relative">
                            <select
                                value={newSkillCategory}
                                onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                                className={selectClasses}
                            >
                                <option value="Tech">Tech</option>
                                <option value="Management">Management</option>
                                <option value="Creative">Creative</option>
                                <option value="Manual">Manual</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addSkill}
                        disabled={!newSkillName.trim()}
                        className="px-6 py-3 bg-cosmic-600 text-white rounded-xl font-semibold hover:bg-cosmic-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                        <Plus className="h-4 w-4" /> Add
                    </motion.button>
                </div>
            </div>

            {/* Skills List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-500" />
                        Your Skill Profile
                    </h4>
                    {profile.skills.length > 0 && (
                        <span className="text-xs text-slate-500">{profile.skills.length} skill{profile.skills.length !== 1 ? 's' : ''}</span>
                    )}
                </div>

                <AnimatePresence mode="popLayout">
                    {profile.skills.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl text-slate-500"
                        >
                            <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-40" />
                            <p>No skills added yet.</p>
                            <p className="text-sm mt-1">Add skills to unlock income boost scenarios.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {profile.skills.map((skill) => {
                                const CategoryIcon = categoryIcons[skill.category];
                                return (
                                    <motion.div
                                        key={skill.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                <CategoryIcon className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{skill.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[skill.level]}`}>
                                                        {skill.level}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{skill.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeSkill(skill.id)}
                                            className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Work Interests */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                    What kind of work do you enjoy? <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                    value={profile.workInterests}
                    onChange={(e) => updateProfile({ workInterests: e.target.value })}
                    placeholder="I enjoy solving complex problems, working with people, building products..."
                    rows={3}
                    className={`${inputClasses} resize-none`}
                />
                <p className="text-xs text-slate-500">
                    This helps us suggest career paths aligned with your interests.
                </p>
            </div>
        </motion.div>
    );
};

export default StepSkills;
