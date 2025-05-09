import Carousel from 'pinar';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Defines the structure for a task object.
 */
interface Task {
    id: string;
    text: string;
    time: string; // HH:MM format e.g., "09:00", "17:30"
    isCompleted: boolean;
}

// Sample tasks - replace with your actual tasks.
// Remember to remove any HTML tags from the 'text' property.
const initialTasks: Task[] = [
    {
        id: '1',
        text: 'Morning Reflection: What am I grateful for today?',
        time: '08:00',
        isCompleted: false,
    },
    {
        id: '2',
        text: 'Mid-day Check-in: Am I living in accordance with my values?',
        time: '12:30',
        isCompleted: false,
    },
    {
        id: '3',
        text: 'Evening Review: What did I learn today and how can I improve tomorrow?',
        time: '17:00',
        isCompleted: false,
    },
    {
        id: '4',
        text: 'Pre-Sleep Contemplation: Prepare for a restful night.',
        time: '21:00',
        isCompleted: false,
    },
    {
        id: '5',
        text: 'Early Bird Task: Plan the day ahead.',
        time: '06:00',
        isCompleted: false,
    },
    { id: '6', text: 'Task for 4 PM', time: '16:00', isCompleted: false },
    { id: '7', text: 'Task for 6 PM', time: '18:00', isCompleted: false },
    { id: '8', text: 'Task for 8 PM', time: '20:00', isCompleted: false },
];

const { width: screenWidth } = Dimensions.get('window');

/**
 * Home component displaying tasks in a carousel.
 * - Shows one task per view.
 * - Displays task closest to the current time on app open (prioritizing past tasks).
 * - Allows marking tasks as complete.
 * - Navigates to the next incomplete task upon completion.
 */
export default function Home() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const carouselRef = useRef<
        Carousel & { scrollToIndex: (index: number, animated: boolean) => void }
    >(null);

    useEffect(() => {
        // Get current time - for testing, we can use the current time from the system
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        console.log(
            `Current time: ${currentHour}:${currentMinute} (${currentTimeInMinutes} minutes)`
        ); // Debug log

        // Filter incomplete tasks and add their original indices
        const incompleteTasksWithIndices = tasks
            .map((task, index) => ({ ...task, originalIndex: index }))
            .filter((task) => !task.isCompleted);

        if (incompleteTasksWithIndices.length === 0) {
            // All tasks are completed or no tasks exist
            setCurrentIndex(tasks.length > 0 ? 0 : -1);
            if (carouselRef.current && tasks.length > 0) {
                carouselRef.current.scrollToIndex(0, false);
            }
            return;
        }

        // Convert all task times to minutes for easier comparison
        const tasksWithTimeInMinutes = incompleteTasksWithIndices.map(
            (task) => {
                const [hours, minutes] = task.time.split(':').map(Number);
                const timeInMinutes = hours * 60 + minutes;
                return { ...task, timeInMinutes };
            }
        );

        // Log all tasks with their times in minutes for debugging
        tasksWithTimeInMinutes.forEach((task) => {
            console.log(
                `Task ${task.id}: ${task.time} (${task.timeInMinutes} minutes)`
            );
        });

        // Find the task with the closest time to current time
        // If two tasks are equally close, prefer the one that's in the past
        let closestTask = tasksWithTimeInMinutes[0];
        let smallestDifference = Math.abs(
            closestTask.timeInMinutes - currentTimeInMinutes
        );
        let isPastTask = closestTask.timeInMinutes <= currentTimeInMinutes;

        for (let i = 1; i < tasksWithTimeInMinutes.length; i++) {
            const task = tasksWithTimeInMinutes[i];
            const difference = Math.abs(
                task.timeInMinutes - currentTimeInMinutes
            );
            const isTaskInPast = task.timeInMinutes <= currentTimeInMinutes;

            // Prefer past tasks over future tasks
            if (
                (isTaskInPast && !isPastTask) ||
                // If both are past or both are future, choose the closest one
                (isTaskInPast === isPastTask &&
                    difference < smallestDifference) ||
                // If differences are the same and both are past, choose the later one
                (isTaskInPast &&
                    isPastTask &&
                    difference === smallestDifference &&
                    task.timeInMinutes > closestTask.timeInMinutes)
            ) {
                closestTask = task;
                smallestDifference = difference;
                isPastTask = isTaskInPast;
            }
        }

        console.log(
            `Selected task ${closestTask.id}: ${closestTask.time} (difference: ${smallestDifference} minutes)`
        ); // Debug log

        const targetIndex = closestTask.originalIndex;

        setCurrentIndex(targetIndex);
        if (carouselRef.current && tasks[targetIndex]) {
            carouselRef.current.scrollToIndex(targetIndex, false);
        }
    }, [tasks]); // Run when tasks change to update the current task

    const handleCompleteTask = (completedTaskId: string): void => {
        const updatedTasks = tasks.map((task) =>
            task.id === completedTaskId ? { ...task, isCompleted: true } : task
        );
        setTasks(updatedTasks);

        const currentTaskOrderIndex = tasks.findIndex(
            (task) => task.id === completedTaskId
        );
        let nextTaskIndex = -1;

        for (let i = 1; i < updatedTasks.length; i++) {
            const potentialNextIndex =
                (currentTaskOrderIndex + i) % updatedTasks.length;
            if (!updatedTasks[potentialNextIndex].isCompleted) {
                nextTaskIndex = potentialNextIndex;
                break;
            }
        }

        if (nextTaskIndex !== -1) {
            setCurrentIndex(nextTaskIndex);
            if (carouselRef.current) {
                carouselRef.current.scrollToIndex(nextTaskIndex, true);
            }
        } else {
            // All tasks might be complete or no other incomplete task found
            const allComplete = updatedTasks.every((t) => t.isCompleted);
            if (allComplete) {
                console.log('All tasks completed!');
                // Optionally, stay or navigate. For now, stays on the last completed task.
            } else {
                console.log('No next incomplete task found.');
            }
        }
    };

    if (currentIndex === -1 || tasks.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.taskText}>No tasks available.</Text>
            </View>
        );
    }

    // Ensure currentIndex is valid before trying to render, especially if tasks can become empty
    if (!tasks[currentIndex] && tasks.length > 0) {
        // This can happen if all tasks are completed and initial logic sets currentIndex out of bounds
        // or if tasks array is manipulated unexpectedly. Fallback to first task.
        setCurrentIndex(0);
        if (carouselRef.current) carouselRef.current.scrollToIndex(0, false);
        return (
            // Or a loading/error view
            <View style={styles.container}>
                <Text style={styles.taskText}>Loading task...</Text>
            </View>
        );
    }
    if (!tasks[currentIndex] && tasks.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.taskText}>No tasks to display.</Text>
            </View>
        );
    }

    return (
        <Carousel
            ref={carouselRef}
            style={styles.carousel}
            showsControls={false}
            showsDots={false}
            // `pinar` typically renders all children. We map tasks to Views.
            // For a large number of tasks, virtualization might be needed with a different carousel.
        >
            {tasks.map((task) => (
                <View style={styles.slide} key={task.id}>
                    <Text style={styles.taskTime}>{task.time}</Text>
                    <Text style={styles.taskText}>{task.text}</Text>
                    {!task.isCompleted && (
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => handleCompleteTask(task.id)}
                        >
                            <Text style={styles.completeButtonText}>
                                Mark as Complete
                            </Text>
                        </TouchableOpacity>
                    )}
                    {task.isCompleted && (
                        <Text style={styles.completedText}>Completed!</Text>
                    )}
                </View>
            ))}
        </Carousel>
    );
}

const styles = StyleSheet.create({
    container: {
        // Used for "No tasks" or loading states
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    carousel: {
        flex: 1,
        backgroundColor: '#e0e0e0', // Background for the carousel area
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#a3c9a8', // Default slide background
        width: screenWidth, // Each slide takes the full width
    },
    taskTime: {
        fontSize: 28, // Larger time
        fontWeight: 'bold',
        color: '#1f2d3d',
        marginBottom: 15,
    },
    taskText: {
        fontSize: 20, // Slightly larger task text
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 28, // Improved readability
    },
    completeButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8, // Softer corners
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    completeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600', // Semi-bold
    },
    completedText: {
        fontSize: 20,
        color: '#27ae60', // Green for completed
        fontWeight: 'bold',
        marginTop: 15,
    },
});
