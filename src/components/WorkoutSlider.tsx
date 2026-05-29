import React, { useState, useEffect, useRef } from 'react';
import { Exercise, DayConfig, ExerciseStatus, WorkoutLog } from '../types';
import { EXERCISES } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Check, Plus, Minus, Info, Timer, Dumbbell, Award, HelpCircle } from 'lucide-react';

interface WorkoutSliderProps {
  day: DayConfig;
  onFinishWorkout: (log: Omit<WorkoutLog, 'id' | 'completedAt'>) => void;
  onClose: () => void;
}

export default function WorkoutSlider({ day, onFinishWorkout, onClose }: WorkoutSliderProps) {
  // Get list of actual exercises for this day
  const dayExercises = React.useMemo(() => {
    return day.exercises
      .map(name => EXERCISES.find(ex => ex.name.toLowerCase() === name.toLowerCase()))
      .filter((ex): ex is Exercise => !!ex);
  }, [day]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const activeExercise = dayExercises[currentIndex];

  // Initialize tracking state for all exercises in this session
  const [exerciseStatusList, setExerciseStatusList] = useState<ExerciseStatus[]>(() => {
    return dayExercises.map(ex => {
      const sets = [];
      for (let i = 1; i <= ex.setCount; i++) {
        sets.push({
          setNumber: i,
          weight: '',
          reps: parseInt(ex.repRange.split('-')[0]) || 10,
          completed: false
        });
      }
      return {
        exerciseName: ex.name,
        sets
      };
    });
  });

  // REST TIMER STATE
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [maxTimerSeconds, setMaxTimerSeconds] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive]);

  // Audio sintetizer beep sound (Standard Web Audio API - no external library needed)
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, audioCtx.currentTime); // Pitch
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Web Audio API not supported or dynamic restriction active', e);
    }
  };

  // Safe navigation
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < dayExercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Modify individual set values
  const handleSetChange = (exerciseName: string, setNumber: number, field: 'weight' | 'reps' | 'completed', value: any) => {
    setExerciseStatusList(prevList => {
      return prevList.map(status => {
        if (status.exerciseName === exerciseName) {
          const updatedSets = status.sets.map(set => {
            if (set.setNumber === setNumber) {
              const updatedSet = { ...set, [field]: value };
              // When set completed is toggled to TRUE, automatically start the rest timer!
              if (field === 'completed' && value === true) {
                setTimerSeconds(maxTimerSeconds);
                setIsTimerActive(true);
              }
              return updatedSet;
            }
            return set;
          });
          return { ...status, sets: updatedSets };
        }
        return status;
      });
    });
  };

  // Calculate high-level progress
  const totalSets = exerciseStatusList.reduce((acc, curr) => acc + curr.sets.length, 0);
  const completedSetsCount = exerciseStatusList.reduce((acc, curr) => {
    return acc + curr.sets.filter(s => s.completed).length;
  }, 0);
  const workoutProgressPercentage = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

  // Final submission of logs
  const [isFinishing, setIsFinishing] = useState(false);
  const [startTime] = useState<Date>(new Date());

  const handleFinish = () => {
    setIsFinishing(true);
    const endTime = new Date();
    const durationMinutes = Math.max(1, Math.round((endTime.getTime() - startTime.getTime()) / 60000));

    onFinishWorkout({
      dayId: day.id,
      dayName: day.title,
      exercisesCompleted: exerciseStatusList.map(item => ({
        exerciseName: item.exerciseName,
        completedSets: item.sets
      })),
      durationMinutes
    });
  };

  // Modal zoom for full screen GIF view
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Time conversion
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExerciseStatus = exerciseStatusList.find(s => s.exerciseName === activeExercise?.name);

  if (!activeExercise) {
    return (
      <div className="bg-[#121626] p-8 rounded-2.5xl text-center border border-white/5 space-y-4">
        <HelpCircle className="h-12 w-12 text-orange-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Exercises Configured</h3>
        <p className="text-neutral-400 text-sm">Please check the configuration of your split day.</p>
        <button onClick={onClose} className="px-5 py-2 bg-neutral-800 text-white rounded-xl text-xs font-semibold">
          Return
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="ppl-workout-active-slider">
      {/* 🚩 Top Navigation and Global Header */}
      <div className="flex items-center justify-between bg-[#121626]/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-neutral-400 hover:text-white transition-colors"
            title="Go to dashboard"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h3 className="font-bold text-white text-base md:text-md">{day.title}</h3>
            <p className="text-xs text-orange-400 flex items-center gap-1 font-mono">
              <Dumbbell className="h-3 w-3 inline" /> {completedSetsCount} / {totalSets} Sets Completed ({workoutProgressPercentage}%)
            </p>
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="bg-green-500 hover:bg-green-600 text-black font-extrabold px-4 py-2 rounded-xl text-xs transition-all duration-150 shadow-sm active:scale-95"
        >
          Finish Workout Session ✓
        </button>
      </div>

      {/* Global Tracker Progress Bar */}
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden" id="session-progress-bar">
        <div 
          className="bg-gradient-to-r from-orange-500 to-green-500 h-full transition-all duration-300"
          style={{ width: `${workoutProgressPercentage}%` }}
        ></div>
      </div>

      {/* 🏋️ Core Screen Splitted Into Slide Info & Side Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="slide-main-grid-container">
        
        {/* LEFT COLUMN (GIF POSTURE CONTAINER & FORM GUIDANCE) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative group bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2.5xl aspect-video select-none">
            <span className="absolute top-4 left-4 z-10 bg-orange-500 text-black font-extrabold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase">
              {activeExercise.badge}
            </span>

            <span className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white font-medium px-3 py-1 rounded-full text-[10px] border border-white/10">
              Form Posture Guide
            </span>

            <img
              src={activeExercise.gif}
              alt={activeExercise.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain cursor-pointer hover:scale-[1.01] transition-transform duration-300"
              onClick={() => setIsZoomModalOpen(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://media.giphy.com/media/l3vQZ8ko4l0nvjmTe/giphy.gif';
              }}
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 pt-12 flex items-end justify-between">
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">{activeExercise.name}</h4>
                <p className="text-neutral-300 text-xs mt-1 font-medium italic opacity-95">
                  🛡️ Use Equipment: {activeExercise.equip}
                </p>
              </div>

              <button 
                onClick={() => setIsZoomModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 text-[10px] px-3 py-1.5 rounded-lg transition-all"
              >
                Inspect Fullscreen
              </button>
            </div>
          </div>

          {/* Form Guide Tips Panel */}
          <div className="bg-[#121626] p-5 rounded-2.5xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
              <Info className="h-4 w-4" /> Posture Tip & Setup
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {activeExercise.tip}
            </p>

            <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 text-xs text-orange-300 space-y-1">
              <span className="font-extrabold uppercase text-[9px] tracking-widest text-orange-400 block mb-0.5">MASS GAIN RULE FOCUS:</span>
              Mool mantra dhyaan rakhein: <span className="font-bold">Tempo Control (Slow Negative)</span>. Dumbbell/Barbell ko niche late waqt poore <span className="underline font-bold">3 Seconds</span> lagne chahiye. Iss slow phase main muscle fiber max damage hote hai jo proper high-protein recovery ke baad strong mass build karte hai.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SET CHECKLISTS & TIMER CONTROLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TRACKING CARD (Sets completed) */}
          <div className="bg-[#121626] p-5 rounded-2.5xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#aaa]">Track Your Sets ({dayExercises[currentIndex].sets})</span>
              <span className="text-xs text-orange-400 font-bold bg-orange-500/10 px-2.5 py-1 rounded-lg">
                Target Reps: {activeExercise.repRange}
              </span>
            </div>

            <div className="divide-y divide-white/5" id="sets-tracker-checklist">
              {currentExerciseStatus?.sets.map((item, index) => (
                <div 
                  key={index} 
                  className={`py-3.5 flex items-center justify-between transition-colors ${
                    item.completed ? 'opacity-55' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-neutral-400 bg-neutral-800 h-6 w-6 rounded-full flex items-center justify-center">
                      S{item.setNumber}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-neutral-400">Weight (KG)</span>
                      <input 
                        type="text" 
                        placeholder="Log weight (e.g. 15)" 
                        value={item.weight}
                        id={`weight-input-${currentIndex}-${index}`}
                        onChange={(e) => handleSetChange(activeExercise.name, item.setNumber, 'weight', e.target.value)}
                        className="w-24 bg-black/40 border border-white/10 rounded-lg text-xs px-2 py-1 text-white text-center focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-neutral-400 mb-1">Reps Done</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleSetChange(activeExercise.name, item.setNumber, 'reps', Math.max(1, item.reps - 1))}
                          className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold font-mono text-white min-w-[20px] text-center">{item.reps}</span>
                        <button 
                          onClick={() => handleSetChange(activeExercise.name, item.setNumber, 'reps', item.reps + 1)}
                          className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSetChange(activeExercise.name, item.setNumber, 'completed', !item.completed)}
                      id={`set-complete-toggle-${currentIndex}-${index}`}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
                        item.completed 
                          ? 'bg-green-500 text-black stroke-[3px]' 
                          : 'bg-black/40 hover:bg-neutral-800 border border-white/10 text-transparent hover:text-neutral-400'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ⏱️ INTEGRATED HIGH FIDELITY REST TIMER */}
          <div className="bg-[#121626] p-5 rounded-2.5xl border border-white/5 space-y-4" id="rest-timer-box">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-400" />
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#aaa]">Rest Timer (Inter-Set Rest)</h4>
              </div>
              <span className="text-[10px] text-[#888] font-mono">Beeper audio auto-chimes at 0s</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Circular clean timer presentation */}
              <div className="md:col-span-6 flex flex-col items-center justify-center py-2 border-b md:border-b-0 md:border-r border-white/5">
                <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-white/5">
                  <div className="absolute inset-0 rounded-full border-4 border-orange-500 opacity-20"></div>
                  
                  {/* Dynamic circular stroke indicator */}
                  <svg className="absolute -rotate-90" width="112" height="112">
                    <circle
                      cx="56"
                      cy="56"
                      r="52"
                      fill="transparent"
                      stroke="#ff5e3a"
                      strokeWidth="4"
                      strokeDasharray="326.72"
                      strokeDashoffset={326.72 - (326.72 * (timerSeconds / maxTimerSeconds))}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>

                  <div className="text-center z-10">
                    <span className="text-2xl font-bold font-mono text-white block leading-none">
                      {formatTime(timerSeconds)}
                    </span>
                    <span className="text-[9px] text-[#aa9] uppercase tracking-widest mt-1 font-bold">
                      {isTimerActive ? 'Resting...' : 'Ready'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-6 space-y-3 p-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-black ${
                      isTimerActive 
                        ? 'bg-yellow-400 hover:bg-yellow-500' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {isTimerActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {isTimerActive ? 'Pause Rest' : 'Start Rest'}
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerActive(false);
                      setTimerSeconds(maxTimerSeconds);
                    }}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button 
                    onClick={() => {
                      const nuSetting = Math.max(30, maxTimerSeconds - 15);
                      setMaxTimerSeconds(nuSetting);
                      setTimerSeconds(nuSetting);
                    }}
                    className="py-1 bg-black/40 hover:bg-neutral-800 rounded-lg text-xs font-mono text-neutral-300 border border-white/5 active:scale-95 transition-all"
                  >
                    -15s ({maxTimerSeconds - 15}s)
                  </button>

                  <button 
                    onClick={() => {
                      const nuSetting = maxTimerSeconds + 15;
                      setMaxTimerSeconds(nuSetting);
                      setTimerSeconds(nuSetting);
                    }}
                    className="py-1 bg-black/40 hover:bg-neutral-800 rounded-lg text-xs font-mono text-neutral-300 border border-white/5 active:scale-95 transition-all"
                  >
                    +15s ({maxTimerSeconds + 15}s)
                  </button>
                </div>

                <div className="pt-1 text-center">
                  <span className="text-[9px] text-[#aa9] uppercase tracking-wider block">Set Default Duration:</span>
                  <div className="flex justify-center gap-1 mt-1">
                    {[60, 90, 120].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          setMaxTimerSeconds(sec);
                          setTimerSeconds(sec);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          maxTimerSeconds === sec 
                            ? 'bg-orange-500 text-black font-extrabold' 
                            : 'bg-[#1b1c2b] text-neutral-400'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 🧭 Foot Navigation Footer slider button details */}
      <div className="flex items-center justify-between border-t border-white/5 pt-5">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 bg-[#121626] hover:bg-[#1a1f33] disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/5 transition-all"
        >
          <ChevronLeft className="h-4 w-4" /> Previous Exercise
        </button>

        <span className="text-xs font-mono text-neutral-400 font-bold bg-[#121626] px-3.5 py-1.5 rounded-full border border-white/5">
          Exercise {currentIndex + 1} of {dayExercises.length} ({dayExercises[currentIndex].name})
        </span>

        {currentIndex === dayExercises.length - 1 ? (
          <button
            onClick={handleFinish}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-black font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            Finish Workout Session <Award className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            Next Exercise <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 🔍 MODAL ZOOM DIALOG */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="fullscreen-gif-modal"
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 cursor-pointer"
            onClick={() => setIsZoomModalOpen(false)}
          >
            <button 
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white text-3xl font-light"
            >
              &times;
            </button>

            <motion.div 
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 10 }}
              className="relative max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden border-2 border-orange-500/50"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeExercise.gif}
                alt={activeExercise.name}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain mx-auto bg-black"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://media.giphy.com/media/l3vQZ8ko4l0nvjmTe/giphy.gif';
                }}
              />
            </motion.div>

            <div className="text-center mt-5 space-y-1">
              <h5 className="text-base font-bold text-white uppercase tracking-wider">{activeExercise.name} Posture Guide</h5>
              <p className="text-xs text-orange-400 font-mono">{activeExercise.badge} • Standard: {activeExercise.sets}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
