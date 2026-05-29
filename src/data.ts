import { Exercise, DayConfig } from './types';

export const EXERCISES: Exercise[] = [
  // 🔴 PUSH DAY
  {
    name: 'Flat Bench Press',
    category: 'push',
    badge: 'Chest',
    sets: '4 Sets x 8-10 Reps',
    setCount: 4,
    repRange: '8-10',
    equip: 'Straight Bar + Plates',
    tip: '3 sec negative, touch chest carefully then press straight up.',
    gif: 'https://i.pinimg.com/originals/1b/df/2b/1bdf2b8c285fad180aab48b659f5c83f.gif'
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'push',
    badge: 'Upper Chest',
    sets: '3 Sets x 10 Reps',
    setCount: 3,
    repRange: '10',
    equip: 'Dumbbells + Bench',
    tip: 'Set bench to 30-45° angle. Keep elbows at a 45° angle for shoulder safety.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif'
  },
  {
    name: 'Overhead Barbell Press',
    category: 'push',
    badge: 'Shoulders',
    sets: '3 Sets x 8-10 Reps',
    setCount: 3,
    repRange: '8-10',
    equip: 'Straight Bar + Plates',
    tip: 'Squeeze your glutes and keep your core tight. Do not arch your lower back excessively.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Press.gif'
  },
  {
    name: 'Lateral Raises',
    category: 'push',
    badge: 'Side Delts',
    sets: '4 Sets x 12-15 Reps',
    setCount: 4,
    repRange: '12-15',
    equip: '5kg Dumbbells',
    tip: 'Maintain a slight elbow bend. Raise dumbbells to shoulder level and pause.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif'
  },
  {
    name: 'Skull Crushers',
    category: 'push',
    badge: 'Triceps',
    sets: '3 Sets x 10-12 Reps',
    setCount: 3,
    repRange: '10-12',
    equip: 'Curl Bar + Plates',
    tip: 'Keep elbows locked and pointed straight up. Lower transition strictly to forehead.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif'
  },
  {
    name: 'Overhead Dumbbell Extension',
    category: 'push',
    badge: 'Triceps',
    sets: '3 Sets x 12 Reps',
    setCount: 3,
    repRange: '12',
    equip: 'Heavy Dumbbell',
    tip: 'Hold the heavy dumbbell with both hands. Keep your upper arms stationary close to your head.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif'
  },

  // 🟢 PULL DAY
  {
    name: 'Barbell Bent-Over Rows',
    category: 'pull',
    badge: 'Back',
    sets: '4 Sets x 8-10 Reps',
    setCount: 4,
    repRange: '8-10',
    equip: 'Straight Bar + Plates',
    tip: 'Hinge at the hips, pull the barbell towards your lower chest, squeeze shoulder blades.',
    gif: 'https://i.pinimg.com/originals/49/dc/9f/49dc9f0329111a2d0d46230c7e75f49b.gif'
  },
  {
    name: 'One-Arm Dumbbell Row',
    category: 'pull',
    badge: 'Lats',
    sets: '3 Sets x 10-12 Reps',
    setCount: 3,
    repRange: '10-12',
    equip: '15kg Dumbbell + Bench',
    tip: 'Pull your elbow towards your hip. Get a full stretch at the bottom of each rep.',
    gif: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/05/dumbbell-row.gif'
  },
  {
    name: 'Rear Delt Flyes',
    category: 'pull',
    badge: 'Rear Shoulders',
    sets: '3 Sets x 15 Reps',
    setCount: 3,
    repRange: '15',
    equip: '5kg Dumbbells',
    tip: 'Bend forward at 90 degrees. Raise dumbbells outwards like a bird flapping wings.',
    gif: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/rear-delt-fly.gif'
  },
  {
    name: 'Barbell Bicep Curls',
    category: 'pull',
    badge: 'Biceps',
    sets: '3 Sets x 10 Reps',
    setCount: 3,
    repRange: '10',
    equip: 'Curl Bar + Plates',
    tip: 'Keep your elbows glued to your sides. Squeeze biceps at the peak of the movement.',
    gif: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/barbell-curl.gif'
  },
  {
    name: 'Seated Hammer Curls',
    category: 'pull',
    badge: 'Brachialis',
    sets: '3 Sets x 10-12 Reps',
    setCount: 3,
    repRange: '10-12',
    equip: '10kg Dumbbells',
    tip: 'Palms facing each other. Control the weight, no body swinging or momentum.',
    gif: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/12/hammer-curls.gif'
  },

  // 🔵 LEGS & ABS DAY
  {
    name: 'Barbell Back Squats',
    category: 'legs',
    badge: 'Quads/Glutes',
    sets: '4 Sets x 8-10 Reps',
    setCount: 4,
    repRange: '8-10',
    equip: 'Straight Bar + Plates',
    tip: 'Squat down below parallel. Take 3 full seconds on the eccentric (downward) phase.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Back-Squat.gif'
  },
  {
    name: 'Romanian Deadlifts (RDL)',
    category: 'legs',
    badge: 'Hamstrings',
    sets: '3 Sets x 10 Reps',
    setCount: 3,
    repRange: '10',
    equip: 'Straight Bar + Plates',
    tip: 'Hinge back at the hips, keep back straight, feel deep stretching in hamstrings.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif'
  },
  {
    name: 'Bulgarian Split Squats',
    category: 'legs',
    badge: 'Quads/Glutes',
    sets: '3 Sets x 12 Reps (Each Leg)',
    setCount: 3,
    repRange: '12',
    equip: 'Dumbbell + Bench',
    tip: 'Elevate back leg on bench. Keep torso upright for quad-focus, or lean slightly for glutes.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif'
  },
  {
    name: 'Dumbbell Calf Raises',
    category: 'legs',
    badge: 'Calves',
    sets: '4 Sets x 15 Reps',
    setCount: 4,
    repRange: '15',
    equip: 'Heavy Dumbbells',
    tip: 'Squeeze calves at peak extension, pause 2 seconds. Control the stretch at the bottom.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif'
  },
  {
    name: 'Bench Leg Raises',
    category: 'legs',
    badge: 'Core/Abs',
    sets: '3 Sets x 15 Reps',
    setCount: 3,
    repRange: '15',
    equip: 'Bench',
    tip: 'Keep lower back pressed flat into bench. Lower your legs slowly without touching the floor.',
    gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Raise.gif'
  }
];

export const SPLIT_DAYS: DayConfig[] = [
  {
    id: 'monday',
    name: 'Monday',
    type: 'push',
    title: 'Push Day 🔴',
    exercises: [
      'Flat Bench Press',
      'Incline Dumbbell Press',
      'Overhead Barbell Press',
      'Lateral Raises',
      'Skull Crushers',
      'Overhead Dumbbell Extension'
    ]
  },
  {
    id: 'tuesday',
    name: 'Tuesday',
    type: 'pull',
    title: 'Pull Day 🟢',
    exercises: [
      'Barbell Bent-Over Rows',
      'One-Arm Dumbbell Row',
      'Rear Delt Flyes',
      'Barbell Bicep Curls',
      'Seated Hammer Curls'
    ]
  },
  {
    id: 'wednesday',
    name: 'Wednesday',
    type: 'legs',
    title: 'Legs & Abs Day 🔵',
    exercises: [
      'Barbell Back Squats',
      'Romanian Deadlifts (RDL)',
      'Bulgarian Split Squats',
      'Dumbbell Calf Raises',
      'Bench Leg Raises'
    ]
  },
  {
    id: 'thursday',
    name: 'Thursday',
    type: 'push',
    title: 'Push Day 🔴',
    exercises: [
      'Flat Bench Press',
      'Incline Dumbbell Press',
      'Overhead Barbell Press',
      'Lateral Raises',
      'Skull Crushers',
      'Overhead Dumbbell Extension'
    ]
  },
  {
    id: 'friday',
    name: 'Friday',
    type: 'pull',
    title: 'Pull Day 🟢',
    exercises: [
      'Barbell Bent-Over Rows',
      'One-Arm Dumbbell Row',
      'Rear Delt Flyes',
      'Barbell Bicep Curls',
      'Seated Hammer Curls'
    ]
  },
  {
    id: 'saturday',
    name: 'Saturday',
    type: 'legs',
    title: 'Legs & Abs Day 🔵',
    exercises: [
      'Barbell Back Squats',
      'Romanian Deadlifts (RDL)',
      'Bulgarian Split Squats',
      'Dumbbell Calf Raises',
      'Bench Leg Raises'
    ]
  },
  {
    id: 'sunday',
    name: 'Sunday',
    type: 'rest',
    title: 'Complete Rest Day ❌',
    exercises: []
  }
];

export const MASS_GAIN_RULES = [
  {
    title: 'Tempo Control (Tempo Control)',
    description: 'Weight ko neeche laate waqt 3 second ka samay lein (Slow Negative) taaki limited plates mein bhi muscle par max load aaye.',
    tip: 'Down phase main dimag se count kijiye: 3.. 2.. 1..'
  },
  {
    title: 'Set Intensity (Intensity Guide)',
    description: 'Weight aisa choose karein jismein set ke aakhri 2 reps nikalne mein poori jaan lag jaye (Near Failure).',
    tip: 'Har sets main progressive overload ko target karein aur notes main weight log karein.'
  },
  {
    title: 'Optimal Recovery (Recovery Rules)',
    description: '6 din ki heavy training ke baad Sunday ko complete rest dein. Heavy protein rich diet rakhein aur 8 ghante ki behtareen neend poori karein.',
    tip: 'Muscle gym ke bahar banta hai jab aap sote hain aur healthy khate hain!'
  }
];
