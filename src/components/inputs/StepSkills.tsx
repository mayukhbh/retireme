import { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import type { Skill, SkillLevel, SkillCategory } from '../../types/retirement';
import { Plus, X, Briefcase } from 'lucide-react';

const StepSkills = () => {
    const { profile, updateProfile } = useProfile();
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
    const [newSkillCategory] = useState<SkillCategory>('Tech');

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-cosmic-500/10 p-6 rounded-xl border border-cosmic-500/20">
                <h3 className="text-lg font-semibold text-cosmic-300 mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> Add Your Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Skill Name</label>
                        <input
                            type="text"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="e.g. React, Project Management"
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            aria-label="Skill name"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Level</label>
                        <select
                            value={newSkillLevel}
                            onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all"
                            aria-label="Skill level"
                        >
                            <option value="Beginner" className="bg-space-900">Beginner</option>
                            <option value="Intermediate" className="bg-space-900">Intermediate</option>
                            <option value="Advanced" className="bg-space-900">Advanced</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={addSkill}
                        disabled={!newSkillName.trim()}
                        className="px-4 py-2 bg-cosmic-600 text-white rounded-lg font-medium hover:bg-cosmic-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(147,51,234,0.2)] hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2"
                        aria-label="Add skill"
                    >
                        <Plus className="h-4 w-4" /> Add
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Your Skill Profile</h4>
                {profile.skills.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl text-slate-400">
                        No skills added yet. Add a few to see better career paths.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {profile.skills.map((skill) => (
                            <div key={skill.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg shadow-sm group hover:border-cosmic-500/50 transition-colors">
                                <div>
                                    <div className="font-medium text-white">{skill.name}</div>
                                    <div className="text-xs text-slate-400">{skill.level} • {skill.category}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill.id)}
                                    className="text-slate-400 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                                    aria-label={`Remove ${skill.name} skill`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">What kind of work do you enjoy?</label>
                <textarea
                    value={profile.workInterests}
                    onChange={(e) => updateProfile({ workInterests: e.target.value })}
                    placeholder="I enjoy solving complex problems, working with people, and building things..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all resize-none"
                    aria-label="Work interests"
                />
            </div>
        </div>
    );
};

export default StepSkills;
