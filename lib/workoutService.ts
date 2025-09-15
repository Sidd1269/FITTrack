import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  restTime: number;
}

export interface Workout {
  id?: string;
  name: string;
  date: string;
  exercises: Exercise[];
  totalSets: number;
  totalVolume: number;
  userId?: string;
  createdAt?: Timestamp;
}

export class WorkoutService {
  private static collectionName = 'workouts';

  static async saveWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<string> {
    try {
      const workoutData = {
        ...workout,
        createdAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, this.collectionName), workoutData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw new Error('Failed to save workout');
    }
  }

  static async getWorkouts(userId?: string): Promise<Workout[]> {
    try {
      let q = query(collection(db, this.collectionName), orderBy('date', 'desc'));
      
      if (userId) {
        q = query(
          collection(db, this.collectionName), 
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to fetch workouts');
    }
  }

  static async deleteWorkout(workoutId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }

  static async getWorkoutsByDateRange(startDate: string, endDate: string, userId?: string): Promise<Workout[]> {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );

      if (userId) {
        q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          orderBy('date', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];
    } catch (error) {
      console.error('Error fetching workouts by date range:', error);
      throw new Error('Failed to fetch workouts by date range');
    }
  }

  static calculateWorkoutStats(workouts: Workout[]) {
    const totalWorkouts = workouts.length;
    const totalVolume = workouts.reduce((sum, workout) => sum + workout.totalVolume, 0);
    const totalSets = workouts.reduce((sum, workout) => sum + workout.totalSets, 0);
    const avgVolumePerWorkout = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0;

    // Calculate weekly frequency
    const workoutsByWeek = workouts.reduce((acc, workout) => {
      const week = this.getWeekNumber(new Date(workout.date));
      acc[week] = (acc[week] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgWorkoutsPerWeek = Object.keys(workoutsByWeek).length > 0 
      ? Object.values(workoutsByWeek).reduce((sum, count) => sum + count, 0) / Object.keys(workoutsByWeek).length 
      : 0;

    return {
      totalWorkouts,
      totalVolume,
      totalSets,
      avgVolumePerWorkout,
      avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10,
    };
  }

  private static getWeekNumber(date: Date): string {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7).toString();
  }
}
