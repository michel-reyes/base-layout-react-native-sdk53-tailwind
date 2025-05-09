export interface Task {
  id: string;
  title: string;
  description: string;
  time: Date; // Represents the scheduled time for the task
  completed: boolean;
}

// Sample tasks for demonstration
// In a real app, this data would likely come from a backend or local storage
export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Reflection',
    description: 'Reflect on the day ahead, set intentions.',
    time: new Date(new Date().setHours(8, 0, 0, 0)), // Today at 8:00 AM
    completed: false,
  },
  {
    id: '2',
    title: 'Mid-day Check-in',
    description: 'Review progress, adjust plans if necessary.',
    time: new Date(new Date().setHours(13, 0, 0, 0)), // Today at 1:00 PM
    completed: false,
  },
  {
    id: '3',
    title: 'Evening Review',
    description: 'Review the day, note accomplishments and learnings.',
    time: new Date(new Date().setHours(20, 0, 0, 0)), // Today at 8:00 PM
    completed: false,
  },
  {
    id: '4',
    title: 'Tomorrow Planning',
    description: 'Plan tasks for the next day.',
    time: new Date(
      new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
        9,
        0,
        0,
        0
      )
    ), // Tomorrow at 9:00 AM
    completed: false,
  },
];
