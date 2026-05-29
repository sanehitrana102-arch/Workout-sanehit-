export interface Exercise {
  name: string;
  category: 'push' | 'pull' | 'legs';
  badge: string;
  sets: string;
  setCount: number;
  repRange: string;
  equip: string;
  tip: string;
  gif: string;
}

export interface DayConfig {
  id: string;
  name: string;
  type: 'push' | 'pull' | 'legs' | 'rest';
  title: string;
  exercises: string[];
}

export interface WorkoutLog {
  id: string;
  dayId: string;
  dayName: string;
  exercisesCompleted: {
    exerciseName: string;
    completedSets: {
      setNumber: number;
      weight: string;
      reps: number;
      completed: boolean;
    }[];
  }[];
  durationMinutes: number;
  completedAt: string;
}

export interface ExerciseStatus {
  exerciseName: string;
  sets: {
    setNumber: number;
    weight: string;
    reps: number;
    completed: boolean;
  }[];
}
