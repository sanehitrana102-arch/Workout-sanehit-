import React from 'react';
import { SPLIT_DAYS, EXERCISES, MASS_GAIN_RULES } from '../data';
import { DayConfig, WorkoutLog } from '../types';
import { motion } from 'motion/react';
import { Dumbbell, Calendar, Heart, Zap, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface DashboardProps {
  onSelectDay: (day: DayConfig) => void;
  logs: WorkoutLog[];
  currentDayIndex: number; // 0 for Sunday, 1 Monday, etc.
}

export default function Dashboard({ onSelectDay, logs, currentDayIndex }: DashboardProps) {
  // Map JS getDay() (0=Sunday, 1=Monday... 6=Saturday) to our SPLIT_DAYS:
  // SPLIT_DAYS: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday
  const getSplitDayIndex = (jsDayIndex: number) => {
    if (jsDayIndex === 0) return 6; // Sunday is index 6
    return jsDayIndex - 1; // Monday=0, Tuesday=1..
  };

  const todaySplitIndex = getSplitDayIndex(currentDayIndex);
  const todayDayConfig = SPLIT_DAYS[todaySplitIndex];

  // Calculate stats
  const completedWorkoutsThisWeek = React.useMemo(() => {
    // Get start of the current week (Monday)
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sun, 1 is Mon...
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust when day is Sunday
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    return logs.filter(log => {
      const logDate = new Date(log.completedAt);
      return logDate >= startOfWeek;
    }).length;
  }, [logs]);

  // Find last workout day to show motivational badge
  const lastWorkout = logs[0]; // Assuming logs are sorted newest first

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
      id="dashboard-container"
    >
      {/* 🚀 Hero Greeting & Today Highlight Section */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b1e30] via-[#141824] to-[#0d0f1a] p-6 md:p-8 border border-orange-500/10 shadow-2xl"
        id="hero-banner"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-orange-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 h-32 w-32 rounded-full bg-red-600/10 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 text-orange-400 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 ml-0.5" /> Direct Posture Guide PPL
            </div>
            
            <h2 className="text-2xl md:text-3.5xl font-bold tracking-tight text-white leading-tight">
              Baniye Apni <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Ultimate Physics</span> 🏋️
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
              Iss program ko follow karein 6 din hafte main aur gain karein Muscle Mass. Iska interactive posture GIFs guide workout ko easy aur accurate bnayega.
            </p>
          </div>

          <div className="bg-[#1e2336]/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center justify-center min-w-[200px]">
            <span className="text-xs text-neutral-400 uppercase font-medium tracking-widest block mb-1">In Action Today</span>
            <span className="text-lg font-bold text-orange-400">{todayDayConfig?.title || 'Rest Day'}</span>
            <span className="text-xs text-neutral-400 font-mono mt-1">
              ({todayDayConfig?.exercises?.length || 0} Exercises Planned)
            </span>
            {todayDayConfig?.type !== 'rest' ? (
              <button
                id="btn-start-today-session"
                onClick={() => onSelectDay(todayDayConfig)}
                className="mt-3.5 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-orange-500/20 active:scale-95"
              >
                <Dumbbell className="h-3.5 w-3.5" /> Start Today's Split
              </button>
            ) : (
              <span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full mt-3 block font-semibold">
                Enjoy Sunday Rest Day!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Quick Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="stats-grid">
        <div className="bg-[#121626] p-4 rounded-2xl border border-white/5 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Total Workouts</div>
            <div className="text-lg font-extrabold text-white">{logs.length} Logged</div>
          </div>
        </div>

        <div className="bg-[#121626] p-4 rounded-2xl border border-white/5 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-red-400/10 text-red-400 shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Streak (Workouts)</div>
            <div className="text-lg font-extrabold text-white">
              {logs.length > 0 ? `${completedWorkoutsThisWeek}/6 completed` : '0 This Week'}
            </div>
          </div>
        </div>

        <div className="bg-[#121626] col-span-2 md:col-span-1 p-4 rounded-2xl border border-white/5 flex items-center gap-3.5 shadow-sm">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Mass Gain Key</div>
            <div className="text-sm font-semibold text-white leading-snug">Slow 3s Negative Negative Tempo</div>
          </div>
        </div>
      </div>

      {/* 📅 Weekly Schedule Split */}
      <div className="space-y-4" id="weekly-schedule-wrapper">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">PPL 6-Day Weekly Schedule</h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Select any day to view details & target pose</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5" id="weekly-days-grid">
          {SPLIT_DAYS.map((day, ix) => {
            const isToday = ix === todaySplitIndex;
            const hasExercises = day.type !== 'rest';
            
            let typeColorClass = 'border-purple-500/15 text-purple-400 bg-purple-500/5';
            if (day.type === 'push') typeColorClass = 'border-red-500/20 text-red-400 bg-red-500/5 hover:border-red-500/40';
            if (day.type === 'pull') typeColorClass = 'border-green-500/20 text-green-400 bg-green-500/5 hover:border-green-500/40';
            if (day.type === 'legs') typeColorClass = 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:border-blue-500/40';
            if (day.type === 'rest') typeColorClass = 'border-neutral-500/15 text-neutral-400 bg-neutral-500/5 hover:border-neutral-500/40';

            return (
              <motion.div
                key={day.id}
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => onSelectDay(day)}
                id={`day-card-${day.id}`}
                className={`relative cursor-pointer flex flex-col justify-between p-4.5 rounded-2.5xl border transition-all duration-200 ${
                  isToday 
                    ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-[#0a0c15] bg-[#1a1e33] border-orange-500/30' 
                    : 'bg-[#121626] border-white/5'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-2 left-4 px-2 py-0.5 bg-orange-500 text-black font-extrabold rounded-full text-[9px] uppercase tracking-wider">
                    Today
                  </span>
                )}

                <div className="space-y-1.5">
                  <div className="text-xs text-neutral-400 font-bold tracking-wide">{day.name}</div>
                  <div className="font-bold text-white text-base leading-tight">
                    {day.type === 'rest' ? 'Sunday Sunday Rest' : day.type.toUpperCase()}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${typeColorClass}`}>
                    {day.type}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {hasExercises ? `${day.exercises.length} Exercises` : 'Rest Day 💤'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 💡 Mass Gain Mini Rules */}
      <div 
        className="bg-gradient-to-r from-orange-950/20 via-[#141824] to-red-950/20 p-5 rounded-2.5xl border border-orange-500/15 space-y-4"
        id="mass-gain-mini-alert"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-400 shrink-0" />
          <h4 className="font-bold text-white text-small md:text-base">Mool Mantra: Muscle Mass Secrets</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
          {MASS_GAIN_RULES.map((rule, idx) => (
            <div key={idx} className="space-y-1 bg-[#121626]/40 p-3.5 rounded-xl border border-white/5">
              <div className="font-bold text-orange-400 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <span className="h-4 w-4 rounded-full bg-orange-500/10 flex items-center justify-center font-bold text-[9px] border border-orange-500/20 text-orange-400 leading-none">
                  {idx + 1}
                </span>
                {rule.title}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed pt-1">{rule.description}</p>
              <div className="text-[10px] text-neutral-400 italic pt-1 flex items-start gap-1">
                <Info className="h-3 w-3 shrink-0 text-orange-500/60 mt-0.5" />
                <span>{rule.tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
