import React, { useState, useEffect } from 'react';
import { SPLIT_DAYS } from './data';
import { DayConfig, WorkoutLog } from './types';
import Dashboard from './components/Dashboard';
import WorkoutSlider from './components/WorkoutSlider';
import ExerciseGrid from './components/ExerciseGrid';
import SecretRules from './components/SecretRules';
import WorkoutHistory from './components/WorkoutHistory';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Calendar, Award, BookOpen, Clock, Heart, Zap, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exercises' | 'secrets' | 'history'>('dashboard');
  const [selectedDay, setSelectedDay] = useState<DayConfig | null>(null);
  
  // Initialize workout logs from local storage
  const [logs, setLogs] = useState<WorkoutLog[]>(() => {
    try {
      const saved = localStorage.getItem('ppl_workout_logs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Sort newest first
        return parsed.sort((a: WorkoutLog, b: WorkoutLog) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
      }
    } catch (e) {
      console.error('Failed to parse logs', e);
    }
    return [];
  });

  // Save logs to local storage when updated
  useEffect(() => {
    localStorage.setItem('ppl_workout_logs_v1', JSON.stringify(logs));
  }, [logs]);

  // Current real-world JS day index (0 for Sunday, 1 Monday, etc.)
  const [currentDayIndex, setCurrentDayIndex] = useState(() => new Date().getDay());

  // Watch for midnight ticks to update current real day
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDayIndex(new Date().getDay());
    }, 60000); // Check once a minute
    return () => clearInterval(timer);
  }, []);

  // Handler to log completed workout
  const handleFinishWorkout = (newLogData: Omit<WorkoutLog, 'id' | 'completedAt'>) => {
    const freshLog: WorkoutLog = {
      ...newLogData,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      completedAt: new Date().toISOString()
    };

    setLogs(prev => [freshLog, ...prev]);
    setSelectedDay(null); // return to dashboard
    setActiveTab('history'); // view logs directly
  };

  // Handler to wipe history logs
  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0c15] text-[#ffffff] font-sans flex flex-col antialiased">
      
      {/* 🚀 Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0d0f1c]/90 backdrop-blur-md border-b border-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div 
            onClick={() => { setSelectedDay(null); setActiveTab('dashboard'); }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            id="brand-logo"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="h-5 w-5 text-black stroke-[2.5px]" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-extrabold tracking-tight text-white leading-none">
                PPL MASS GUIDE
              </h1>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest font-mono block mt-0.5">
                Slow Negative 3s
              </span>
            </div>
          </div>

          {/* Regular Screens Desktop Tabs */}
          <nav className="hidden md:flex items-center gap-1.5" id="dekstop-navbar-links">
            {[
              { id: 'dashboard', label: '📅 Split Plan', icon: Calendar },
              { id: 'exercises', label: '🎬 Posture Library', icon: Dumbbell },
              { id: 'secrets', label: '💡 Mass Secrets', icon: Sparkles },
              { id: 'history', label: '⏳ Records Log', icon: Clock }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id && !selectedDay;
              return (
                <button
                  key={tab.id}
                  id={`nav-btn-${tab.id}`}
                  onClick={() => { 
                    setSelectedDay(null); 
                    setActiveTab(tab.id as any); 
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-orange-500 text-black shadow-md shadow-orange-500/15'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Active Badge or Rest Highlight */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white/5 border border-white/5 px-2.5 py-1 rounded-full font-mono text-neutral-400">
              UTC: {new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

        </div>
      </header>

      {/* 🏋️ Core Content Router body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* If user is inside an ACTIVE WORKOUT SESSION (Slider Follower) */}
        {selectedDay ? (
          <WorkoutSlider 
            day={selectedDay}
            onFinishWorkout={handleFinishWorkout}
            onClose={() => setSelectedDay(null)}
          />
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <Dashboard 
                onSelectDay={(day) => {
                  if (day.type === 'rest') {
                    alert("Aapka aaj rest day hai. Sunday ko muscle recovery par focus karein aur kal Push day se full power lagayein!");
                  } else {
                    setSelectedDay(day);
                  }
                }}
                logs={logs}
                currentDayIndex={currentDayIndex}
              />
            )}

            {activeTab === 'exercises' && (
              <ExerciseGrid />
            )}

            {activeTab === 'secrets' && (
              <SecretRules />
            )}

            {activeTab === 'history' && (
              <WorkoutHistory 
                logs={logs}
                onClearLogs={handleClearLogs}
              />
            )}
          </AnimatePresence>
        )}

      </main>

      {/* 📱 Mobile Static Bottom Bar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f1c]/95 backdrop-blur-lg border-t border-white/5 pb-safe" id="mobile-navigation-bar">
        <div className="grid grid-cols-4 h-16 divide-x divide-white/5 max-w-md mx-auto">
          {[
            { id: 'dashboard', label: 'Schedule', icon: Calendar },
            { id: 'exercises', label: 'Posture', icon: Dumbbell },
            { id: 'secrets', label: 'Secrets', icon: Sparkles },
            { id: 'history', label: 'Records', icon: Clock }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id && !selectedDay;

            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => {
                  setSelectedDay(null);
                  setActiveTab(tab.id as any);
                }}
                className={`flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  isActive 
                    ? 'text-orange-500' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <TabIcon className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* Clear height cushion for mobile navigation bottom */}
      <div className="h-16 md:hidden"></div>

      {/* Elegant minimalist bottom credit mark */}
      <footer className="py-6 text-center border-t border-white/5 max-w-7xl mx-auto w-full text-[11px] text-neutral-600 font-mono space-y-1">
        <div>🏋️ PPL Muscle-Mass Follower • Slow Eccentrics 3 sec Down phase</div>
        <div>All posture guides and target reps strictly configured • No backend required</div>
      </footer>

    </div>
  );
}
