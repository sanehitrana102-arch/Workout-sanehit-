import React, { useState, useEffect } from 'react';
import { MASS_GAIN_RULES } from '../data';
import { motion } from 'motion/react';
import { Zap, Timer, Award, Activity, Heart, Check, ChevronRight } from 'lucide-react';

export default function SecretRules() {
  // Tempo simulator states
  const [tempoState, setTempoState] = useState<'idle' | 'lifting' | 'holding' | 'eccentric'>('idle');
  const [tempoTimer, setTempoTimer] = useState(0);

  // Failure scale calculator state
  const [userWeight, setUserWeight] = useState<number>(70);
  const [goal, setGoal] = useState<'mass' | 'extreme'>('mass');

  // Simulated lift tempo animation sequence:
  const runTempoLiftSimulation = () => {
    if (tempoState !== 'idle') return;

    // Start with 1s lifting
    setTempoState('lifting');
    setTempoTimer(1);

    const timer = setInterval(() => {
      setTempoState(curr => {
        if (curr === 'lifting') {
          // transition to peak hold
          setTempoTimer(1);
          return 'holding';
        }
        if (curr === 'holding') {
          // transitions to slow negative (3s countdown!)
          setTempoTimer(3);
          return 'eccentric';
        }
        if (curr === 'eccentric') {
          // Finished!
          clearInterval(timer);
          setTempoTimer(0);
          return 'idle';
        }
        return 'idle';
      });
    }, 1500);
  };

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (tempoState === 'eccentric' && tempoTimer > 0) {
      t = setInterval(() => {
        setTempoTimer(prev => {
          if (prev <= 1) {
            clearInterval(t);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [tempoState, tempoTimer]);

  // Protein calculation
  const proteinTarget = userWeight * (goal === 'extreme' ? 2.2 : 1.8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
      id="secrets-rules-room"
    >
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h3 className="text-2xl font-bold text-white tracking-tight">Mass Gain Fundamental Secrets Guide</h3>
        <p className="text-xs text-neutral-400">
          In 3 main secrets ko follow karke aap kam se kam weight equipment ke sath bhi muscular and high density lean muscle mass achieve kar sakte hain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ⏱️ TEMPO CONTROL DETAILED INTERACTIVE SIMULATION */}
        <div className="bg-[#121626] p-6 rounded-2.5xl border border-white/5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-orange-400" />
            <h4 className="font-bold text-white text-base">Secret 1: Interative Tempo Simulator</h4>
          </div>
          
          <p className="text-neutral-400 text-xs leading-relaxed">
            <b>3-Second Slow Negative Negative:</b> Weight ko lifting segment ke bad niche loundering (eccentric focus) sequence me slow-paced 3 seconds count kijiye. Squeeze damage rate badh jayega.
          </p>

          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-6">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Simulated Bench Barbell</span>
            
            {/* Visualizer Plate Barbell */}
            <div className="w-full max-w-[280px] h-32 relative bg-[#1b1c28]/60 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
              
              {/* Bench representation */}
              <div className="absolute bottom-2 w-32 h-2 bg-neutral-800 rounded"></div>
              <div className="absolute bottom-2 left-1/2 -ml-1.5 w-3 h-14 bg-neutral-800/40"></div>

              {/* Plate bar */}
              <motion.div 
                animate={{
                  y: tempoState === 'lifting' ? -35 : tempoState === 'holding' ? -35 : tempoState === 'eccentric' ? 12 : 12
                }}
                transition={{
                  duration: tempoState === 'lifting' ? 1.0 : tempoState === 'eccentric' ? 3.0 : 0.3
                }}
                className="absolute flex items-center justify-center w-48 z-10"
              >
                {/* Plate on left */}
                <div className="w-4 h-12 bg-orange-600 rounded-md border border-orange-500 shadow-md"></div>
                <div className="w-2 h-8 bg-neutral-500 rounded-sm"></div>
                
                {/* Bar */}
                <div className="h-1 bg-neutral-300 w-36"></div>
                
                {/* Plate on right */}
                <div className="w-2 h-8 bg-neutral-500 rounded-sm"></div>
                <div className="w-4 h-12 bg-orange-600 rounded-md border border-orange-500 shadow-md"></div>
              </motion.div>

              {/* Target guidelines indicator */}
              <div className="absolute top-[25%] left-4 right-4 h-0.5 border-t border-dashed border-white/10 flex justify-between px-2">
                <span className="text-[8px] text-neutral-600 uppercase">Limit Peak</span>
                <span className="text-[8px] text-neutral-600 uppercase">Start Bar</span>
              </div>
            </div>

            {/* Simulated Live States */}
            <div className="flex justify-between items-center w-full max-w-[280px] text-xs px-2">
              <span className="text-neutral-400">Current Phase:</span>
              <strong className={`uppercase ${
                tempoState === 'lifting' ? 'text-green-400' :
                tempoState === 'holding' ? 'text-yellow-400 animate-pulse' :
                tempoState === 'eccentric' ? 'text-orange-400' : 'text-[#888]'
              }`}>
                {tempoState === 'idle' && '💤 Idle (Tap Start)'}
                {tempoState === 'lifting' && '⚡ Concentric (Lift up - 1s)'}
                {tempoState === 'holding' && '✊ Squeeze (Hold Peak - 1s)'}
                {tempoState === 'eccentric' && `🔴 Eccentric (Slow down - ${tempoTimer}s)`}
              </strong>
            </div>

            <button
              onClick={runTempoLiftSimulation}
              disabled={tempoState !== 'idle'}
              className="w-full max-w-[280px] bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-black font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Test 3-Second Lift Sequence 🚀
            </button>
          </div>
        </div>

        {/* 🍽️ NUTRITION & PROTEIN CALCULATOR FOR RECOVERY */}
        <div className="bg-[#121626] p-6 rounded-2.5xl border border-white/5 space-y-5 shadow-lg">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <h4 className="font-bold text-white text-base">Secret 2: Daily Protein Target Multiplier</h4>
          </div>

          <p className="text-neutral-400 text-xs leading-relaxed">
            Sunday rest and active recovery works miracles only if your body receives enough building blocks (amino acids). Use the target tool below based on bodyweight:
          </p>

          <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/5">
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 uppercase tracking-widest font-bold block">
                Enter Your Weight (KG):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={userWeight}
                  id="nutrition-weight-input"
                  onChange={(e) => setUserWeight(Math.max(30, parseInt(e.target.value) || 0))}
                  className="bg-black/10 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm w-32 focus:border-orange-500/50 focus:outline-none"
                />
                <span className="text-xs text-neutral-400">Your Current Mass KG</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold block">
                Goal Tier:
              </span>
              <div className="grid grid-cols-2 gap-2" id="goal-tier-tabs">
                <button
                  onClick={() => setGoal('mass')}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                    goal === 'mass' 
                      ? 'bg-orange-500 text-black' 
                      : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  Mass Gain (1.8g/kg)
                </button>
                <button
                  onClick={() => setGoal('extreme')}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                    goal === 'extreme' 
                      ? 'bg-orange-500 text-black' 
                      : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  Hardcore Build (2.2g/kg)
                </button>
              </div>
            </div>

            {/* Target Card Display */}
            <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">YOUR OPTIMAL DAILY PROTEIN TARGET:</span>
                <div className="text-2xl font-bold font-mono text-white mt-0.5">
                  {Math.round(proteinTarget)} grams / day
                </div>
              </div>
              <Award className="h-8 w-8 text-orange-400" />
            </div>

            <div className="text-[11px] text-neutral-400 leading-normal italic">
              *Try spacing this target protein out into 4-5 meals containing 30-40g protein each (e.g. eggs, paneer, chicken breast, tofu, soya chunks, whey, sattu or pulses) to maximize your Muscle Protein Synthesis (MPS).
            </div>
          </div>
        </div>

      </div>

      {/* 🔴 SET INTENSITY RPE TARGET METHOD */}
      <div 
        className="bg-[#121626] p-6 rounded-2.5xl border border-white/5 space-y-4"
        id="secrets-intensity-chart"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-400" />
          <h4 className="font-bold text-white text-base">Secret 3: Intensity & Representative Failure RPE Targets</h4>
        </div>

        <p className="text-neutral-400 text-sm">
          "Weight aisa load karein jismein set ke aakhri 2 reps nikalne mein poori jaan lag jaye." This represents <b>RPE 8-9 (Reps in Reserve 1-2)</b>. Isko follow karein to produce maximum target gains:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1" id="rpe-scale-guide">
          {[
            { rate: 'RPE 10', target: '0 Reps in Reserve', text: 'Ultimate Failure. Barbell and weight won\'t move anymore. High neural fatigue.', scale: 'border-red-500/30 text-red-400 bg-red-500/5' },
            { rate: 'RPE 9', target: '1 Rep in Reserve', text: 'Optimal Hypertrophy limit. Apse maximum 1 pre-calculated extra rep ho skta tha.', scale: 'border-orange-500/30 text-orange-400 bg-orange-500/5' },
            { rate: 'RPE 8', target: '2 Reps in Reserve', text: 'Sweet spot for home gym exercises. Poori jaan lgti h, maintains form safely.', scale: 'border-orange-400/30 text-orange-400 bg-orange-400/5' },
            { rate: 'RPE 6-7', target: '3+ Reps in Reserve', text: 'Warm up / Cardio state. Dynamic mass stimulation is low. Try adding weight!', scale: 'border-neutral-500/30 text-neutral-400 bg-neutral-500/5' }
          ].map((item, index) => (
            <div key={index} className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${item.scale}`}>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider block font-mono">
                  {item.rate}
                </span>
                <span className="text-xs font-semibold block text-white/95 mt-0.5">
                  {item.target}
                </span>
                <p className="text-[11px] text-neutral-300 leading-relaxed mt-2">
                  {item.text}
                </p>
              </div>
              
              <div className="flex justify-end pt-2">
                {index === 2 && (
                  <span className="text-[9px] uppercase tracking-widest font-extrabold bg-[#ff5e3a] text-black px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
