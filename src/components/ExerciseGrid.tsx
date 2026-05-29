import React, { useState } from 'react';
import { EXERCISES } from '../data';
import { Exercise } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Search, Filter, Info, ShieldAlert, Sliders } from 'lucide-react';

export default function ExerciseGrid() {
  const [activeTab, setActiveTab] = useState<'all' | 'push' | 'pull' | 'legs'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGif, setSelectedGif] = useState<Exercise | null>(null);

  // Filter exercises
  const filteredExercises = React.useMemo(() => {
    return EXERCISES.filter(ex => {
      const matchesTab = activeTab === 'all' || ex.category === activeTab;
      const matchesSearch = 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ex.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.equip.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6" id="exercise-catalog-grid">
      {/* Search Header and Quick Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            id="search-exercises-input"
            placeholder="Search exercises, muscles (e.g., biceps, bench)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121626] border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-1.5 bg-[#121626] p-1.5 rounded-2xl border border-white/5" id="exercise-category-tabs">
          {(['all', 'push', 'pull', 'legs'] as const).map(tab => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase ${
                activeTab === tab
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'all' && 'All Split'}
              {tab === 'push' && '🔴 Push'}
              {tab === 'pull' && '🟢 Pull'}
              {tab === 'legs' && '🔵 Legs & Abs'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view of exercise gifs */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
        id="exercises-grid-wrapper"
      >
        <AnimatePresence mode="popLayout">
          {filteredExercises.map((ex) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={ex.name}
              id={`exercise-card-${ex.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedGif(ex)}
              className="group bg-[#141824] rounded-2.5xl overflow-hidden border border-orange-500/15 cursor-pointer hover:border-orange-500 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
            >
              {/* GIF post image wrapper */}
              <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={ex.gif}
                  alt={ex.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://media.giphy.com/media/l3vQZ8ko4l0nvjmTe/giphy.gif';
                  }}
                />
                
                {/* Visual Category Dot Overlay */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-white border border-white/5">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    ex.category === 'push' ? 'bg-red-500' : ex.category === 'pull' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></span>
                  {ex.category.toUpperCase()}
                </div>

                <div className="absolute top-3 right-3 bg-orange-500 text-black font-extrabold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
                  {ex.badge}
                </div>
              </div>

              {/* Workout Metadata */}
              <div className="p-4.5 space-y-3">
                <div>
                  <h4 className="font-bold text-white text-md group-hover:text-orange-400 transition-colors">
                    {ex.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-medium mt-1">
                    🔧 Equipment: {ex.equip}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-xs text-neutral-400 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-neutral-500">Sets & target reps:</span>
                    <span className="font-bold text-white font-mono">{ex.sets}</span>
                  </div>
                  <div className="text-[11px] leading-relaxed text-neutral-300 line-clamp-2">
                    💡 <span className="font-semibold text-orange-400/90 font-mono">Form:</span> {ex.tip}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State Illustration */}
      {filteredExercises.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-[#121626] rounded-2.5xl border border-white/5">
          <ShieldAlert className="h-10 w-10 text-neutral-500 mx-auto" />
          <h5 className="font-bold text-white">Oops, No Exercises Match</h5>
          <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed">
            Hume is name se koi exercise nahi mili. Alag query (e.g. Biceps, squat, chest) search krke dekhein.
          </p>
        </div>
      )}

      {/* 🔍 INDIVIDUAL GRID DETAILED ZOOM DIALOG & FORM SPECIFICATIONS */}
      <AnimatePresence>
        {selectedGif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="exercise-enlarged-modal"
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 md:p-6 cursor-pointer"
            onClick={() => setSelectedGif(null)}
          >
            <button 
              onClick={() => setSelectedGif(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white text-3xl font-light"
            >
              &times;
            </button>

            <motion.div 
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              className="relative max-w-2xl w-full bg-[#121626] rounded-3xl overflow-hidden border border-orange-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* GIF top portion */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <img
                  src={selectedGif.gif}
                  alt={selectedGif.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full object-contain mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://media.giphy.com/media/l3vQZ8ko4l0nvjmTe/giphy.gif';
                  }}
                />
                
                <span className="absolute top-4 left-4 bg-orange-500 text-black font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                  {selectedGif.badge}
                </span>

                <span className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full font-mono uppercase">
                  {selectedGif.category} Day
                </span>
              </div>

              {/* Informative instructions below GIF */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{selectedGif.name}</h3>
                  <div className="flex gap-4 mt-2 text-xs text-neutral-400 font-mono">
                    <span>🎬 Sets: <b className="text-white">{selectedGif.sets}</b></span>
                    <span>•</span>
                    <span>🔧 Equipement: <b className="text-white">{selectedGif.equip}</b></span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-orange-400">Postural Rules (Proper Form Guide):</div>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {selectedGif.tip}
                  </p>
                </div>

                <div className="bg-orange-500/10 p-3.5 rounded-xl border border-orange-500/10 text-xs text-orange-300 leading-relaxed font-sans">
                  ⚠️ <span className="font-extrabold">Tempo Mantra (3s Eccentric):</span> Es exercise ko performing ke samay, gravity ke pull ko resist karein (weight ko upar se neeche dhire-dhire 3 seconds main laayein). Isse hard failure levels achieve honge.
                </div>

                <button
                  onClick={() => setSelectedGif(null)}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-3.5 rounded-xl transition-all"
                >
                  Close Guide Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
