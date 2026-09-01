'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, User as UserIcon } from 'lucide-react';
import { UserCard } from '../components/UserCard';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const { editProfileMutation } = useProfile();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    photoUrl: '',
    age: '',
    gender: '',
    about: '',
    skills: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        photoUrl: user.photoUrl || '',
        age: user.age ? user.age.toString() : '',
        gender: user.gender || '',
        about: user.about || '',
        skills: user.skills ? user.skills.join(', ') : '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : undefined,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
    };
    editProfileMutation.mutate(submitData);
  };

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  // Preview user object
  const previewUser = {
    ...user,
    ...formData,
    age: formData.age ? parseInt(formData.age, 10) : undefined,
    skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-16 flex flex-col md:flex-row gap-8">
      
      {/* Edit Form */}
      <div className="flex-1 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
        <div className="mb-8 flex items-center gap-3">
          <UserIcon className="w-8 h-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Photo URL</label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, TypeScript"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">About Me</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={editProfileMutation.isPending}
            className="w-full py-4 bg-pink-500 text-white rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors flex items-center justify-center shadow-lg shadow-pink-500/20 disabled:opacity-50"
          >
            {editProfileMutation.isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              'Save Profile'
            )}
          </button>
        </form>
      </div>

      {/* Profile Preview */}
      <div className="flex-1 md:max-w-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-neutral-400">Profile Preview</h2>
        <UserCard user={previewUser as any} />
      </div>

    </div>
  );
};
