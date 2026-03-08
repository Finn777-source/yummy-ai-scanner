export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: number;
}

export interface DailyData {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  goal: number;
}

const STORAGE_KEY = 'calorie-tracker-data';
const GOAL_KEY = 'calorie-tracker-goal';

export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function getDailyData(date: Date = new Date()): DailyData {
  const key = getDateKey(date);
  const stored = localStorage.getItem(STORAGE_KEY);
  const allData: Record<string, FoodEntry[]> = stored ? JSON.parse(stored) : {};
  return {
    date: key,
    entries: allData[key] || [],
    goal: getGoal(),
  };
}

export function addEntry(entry: FoodEntry, date: Date = new Date()): void {
  const key = getDateKey(date);
  const stored = localStorage.getItem(STORAGE_KEY);
  const allData: Record<string, FoodEntry[]> = stored ? JSON.parse(stored) : {};
  if (!allData[key]) allData[key] = [];
  allData[key].push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

export function removeEntry(entryId: string, date: Date = new Date()): void {
  const key = getDateKey(date);
  const stored = localStorage.getItem(STORAGE_KEY);
  const allData: Record<string, FoodEntry[]> = stored ? JSON.parse(stored) : {};
  if (allData[key]) {
    allData[key] = allData[key].filter(e => e.id !== entryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }
}

export function getGoal(): number {
  return parseInt(localStorage.getItem(GOAL_KEY) || '2000', 10);
}

export function setGoal(goal: number): void {
  localStorage.setItem(GOAL_KEY, goal.toString());
}

export function getTotalCalories(entries: FoodEntry[]): number {
  return entries.reduce((sum, e) => sum + e.calories, 0);
}

export function getWeekData(): DailyData[] {
  const days: DailyData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getDailyData(d));
  }
  return days;
}
