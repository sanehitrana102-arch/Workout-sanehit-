import React from 'react';
import { WorkoutLog } from '../types';
import { motion } from 'motion/react';
import { Dumbbell, Calendar, Heart, Clock, Trash2, Award, ClipboardCheck } from 'lucide-react';

interface WorkoutHistoryProps {
  logs: WorkoutLog[];
  onClearLogs: () => void;
}

export default function WorkoutHistory({ logs, onClearLogs }: WorkoutHistoryProps) {
  // Safe Date Converter
  const formatDateString = (dtStr: string) => {
    try {
      const dt = new Date(dtStr);
      return dt.toLocaleDateString('hi-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dtStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
      id="workout-logs-history-board"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-orange-500" /> Historic Logs & Progress Records
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Apke completed sessions ka data, tracking and exercise-by-exercise progressive weights details yahan save hote hain.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Kya aap sach me saare historic logs mita dena chahte hain?")) {
                onClearLogs();
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 md:bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-xl transition duration-150 flex items-center gap-1 border border-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear All History
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20 bg-[#121626] rounded-2.5xl border border-white/5 space-y-4">
          <Dumbbell className="h-12 w-12 text-neutral-500 mx-auto" id="no-history-icon" />
          <h4 className="text-base font-semibold text-white">No Completed Workout Sessions Yet</h4>
          <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed">
            Abhi tak koi session save nahi kiya gya hai. Dashboard par jye aur start kijiye aaj ka active workout split follow karke!
          </p>
        </div>
      ) : (
        <div className="space-y-4" id="scrolling-logs">
          {logs.map((log) => {
            // Count total sets completed in this log
            const setsTotal = log.exercisesCompleted.reduce((acc, curr) => acc + curr.completedSets.length, 0);
            const setsCompleted = log.exercisesCompleted.reduce((acc, curr) => {
              return acc + curr.completedSets.filter(s => s.completed).length;
            }, 0);

            return (
              <div 
                key={log.id} 
                className="bg-[#121626] border border-white/5 p-5 rounded-2.5xl space-y-4 shadow-md hover:border-orange-500/20 transition-all duration-200"
              >
                {/* Headers */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase bg-orange-500 text-black px-2.5 py-0.5 rounded-full inline-block">
                      {log.dayName}
                    </span>
                    <h4 className="text-xs font-mono text-neutral-400 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-orange-400" /> {formatDateString(log.completedAt)}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 font-mono text-neutral-300">
                      <Clock className="h-3.5 w-3.5 text-orange-400" /> {log.durationMinutes} minutes
                    </span>
                    <span className="bg-orange-500/10 text-orange-400 font-extrabold px-2.5 py-1 rounded-lg">
                      {setsCompleted} / {setsTotal} Sets Checked
                    </span>
                  </div>
                </div>

                {/* Exercises Log details list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {log.exercisesCompleted.map((ex, exIdx) => {
                    // Check if they completed at least one set
                    const hasCompletes = ex.completedSets.some(s => s.completed);
                    if (!hasCompletes) return null;

                    return (
                      <div key={exIdx} className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-white">
                          <span className="text-orange-300 font-bold">{ex.exerciseName}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {ex.completedSets.filter(s => s.completed).length} Sets Checked
                          </span>
                        </div>

                        {/* Sets row breakdown */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/5">
                          {ex.completedSets.map((set, setIdx) => {
                            if (!set.completed) return null;
                            return (
                              <span 
                                key={setIdx} 
                                className="bg-[#1d2238] border border-white/10 text-[10px] px-2.5 py-1 rounded-md text-neutral-300 font-mono shrink-0"
                              >
                                Set {set.setNumber}: <b className="text-[#ff8c4a]">{set.weight || 'No'} kg</b> &times; <b>{set.reps} rep</b>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
