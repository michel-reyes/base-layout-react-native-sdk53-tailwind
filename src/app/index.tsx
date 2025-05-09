import Carousel from 'pinar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define monochromatic color constants first
const MONOCHROMATIC_TEXT_COLOR = '#E0E0E0'; // Light gray for text on dark background
const MONOCHROMATIC_BORDER_COLOR = '#666666'; // Medium-dark gray for borders on dark background
const MONOCHROMATIC_DOT_INACTIVE_COLOR = '#555555'; // Darker gray for inactive dots on dark background
const MONOCHROMATIC_DOT_ACTIVE_COLOR = '#AAAAAA'; // Lighter gray for active dots on dark background

// Styles for Markdown content (monochromatic)
const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold' as 'bold',
    marginBottom: 20,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  heading2: {
    fontSize: 22,
    fontWeight: 'bold' as 'bold',
    marginBottom: 8,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold' as 'bold',
    marginBottom: 6,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  bullet_list_icon: {
    // Style for the bullet points themselves
    fontSize: 16, // Consistent with list_item text
    lineHeight: 24, // Consistent with list_item text
    color: MONOCHROMATIC_TEXT_COLOR,
    marginRight: 8, // Space between bullet and text
  },
  text: {
    // General text rule, often maps to paragraph
    fontSize: 16,
    lineHeight: 24,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  em: {
    // Italic
    fontStyle: 'italic' as 'italic',
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  strong: {
    // Bold
    fontWeight: 'bold' as 'bold',
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  blockquote: {
    fontStyle: 'italic' as 'italic',
    borderLeftWidth: 4,
    borderLeftColor: MONOCHROMATIC_BORDER_COLOR, // Use border color for consistency
    paddingLeft: 10,
    marginLeft: 10,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color (for text inside blockquote)
  },
  list_item: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 5,
    color: MONOCHROMATIC_TEXT_COLOR, // Apply light text color
  },
  // Add other styles as needed, ensuring they are monochromatic
};

/**
 * Defines the structure for a task object.
 */
interface Task {
  id: string;
  text: string; // Markdown formatted text
  time: string; // HH:MM format e.g., "09:00", "17:30"
  isCompleted: boolean;
}

// Sample tasks with markdown formatting
const initialTasks: Task[] = [
  // Rutina Matutina "El Timón del Día"
  {
    id: '1',
    time: '07:00',
    text: '# Despertar y Memento Mori\n\n- **Levántate** consistentemente (incluso fines de semana).\n- Evita el botón de snooze (tu primera victoria).\n- Dedica un minuto a Memento Mori: valora el día, enfócate en lo esencial.',
    isCompleted: false,
  },
  {
    id: '2',
    time: '07:30',
    text: '# Hidratación y Movimiento Ligero\n\n- Bebe un vaso grande de agua.\n- Realiza estiramientos suaves o saludos al sol (5-10 min) para despertar el cuerpo.',
    isCompleted: false,
  },
  {
    id: '3',
    time: '07:40',
    text: '# Reflexión Estoica y Planificación (Premeditatio Malorum)\n\n**Diario/Reflexión (10-15 min):**\n- **Gratitud:** Escribe 3 cosas por las que estás agradecido.\n- **Visualización del Día (Premeditatio Malorum):** Piensa en desafíos probables. Visualiza cómo responderás con calma, razón y virtud (Sabiduría, Justicia, Coraje, Templanza).\n- **Objetivo Principal:** Define 1-3 tareas importantes. Enfócate en tu esfuerzo y acciones (Dicotomía del Control).',
    isCompleted: false,
  },
  {
    id: '4',
    time: '08:00',
    text: '# Ejercicio Físico Enfocado (30-60 min)\n\n*No es negociable. Combina:*\n- **Fuerza** (2-3 días/semana): Mantener masa muscular y metabolismo.\n- **Cardio** (2-3 días/semana): Salud cardiovascular, manejo del estrés.\n- **Movilidad/Flexibilidad** (Diario o varios días/semana): Contrarrestar rigidez, prevenir lesiones.\n\n*Principio Estoico: Cuida tu cuerpo como un templo.*',
    isCompleted: false,
  },
  {
    id: '5',
    time: '08:30',
    text: '# Ducha Fría (Opcional)\n\nExcelente para la disciplina, estado de alerta y recuperación. Empieza gradualmente. Si no, ducha normal.',
    isCompleted: false,
  },
  {
    id: '6',
    time: '08:45',
    text: '# Higiene y Vestimenta\n\nVístete de forma que te sientas preparado y profesional, incluso si trabajas desde casa. Es una señal de respeto propio.',
    isCompleted: false,
  },
  {
    id: '7',
    time: '09:00',
    text: '# Desayuno Nutritivo y Consciente\n\n- Come sin distracciones (sin teléfono ni pantallas).\n- Enfócate en proteínas, grasas saludables y carbohidratos complejos. Evita azúcares simples.\n- Mastica despacio. Templanza en la alimentación.',
    isCompleted: false,
  },
  // Rutina Durante el Trabajo
  {
    id: '8',
    time: '09:30', // Example start time
    text: '# Bloques de Trabajo Profundo (Pomodoro Modificado)\n\n- Trabaja en bloques concentrados (ej. 50 min) seguidos de descansos cortos (10 min).\n- Durante los bloques, cero distracciones (notificaciones apagadas).',
    isCompleted: false,
  },
  {
    id: '9',
    time: '10:20', // Example after 1st Pomodoro
    text: '# Descansos Activos\n\n- En cada descanso: levántate, camina, haz estiramientos (cuello, hombros, espalda, muñecas).\n- Hidrátate. Descansa la vista (regla 20-20-20).',
    isCompleted: false,
  },
  {
    id: '10',
    time: '11:00', // Example mid-morning
    text: '# Manejo Estoico de Desafíos (Bugs, Interrupciones)\n\n- **Ante un problema de código:** Respira. Dicotomía del control. Enfócate en depurar con paciencia y método (Sabiduría). Aceptación (Amor Fati).\n- **Ante interrupciones:** Evalúa urgencia. Aprende a decir "no" o posponer (Templanza, Justicia).',
    isCompleted: false,
  },
  {
    id: '11',
    time: '13:00', // Example lunch time
    text: '# Almuerzo Consciente\n\n- Aléjate del escritorio.\n- Come saludablemente y sin prisas.',
    isCompleted: false,
  },
  {
    id: '12',
    time: '16:00', // Example late afternoon
    text: '# Aprendizaje Continuo\n\nDedica tiempo específico para aprender algo nuevo (Typescript, React Native, Expo, patrones de diseño, etc.). El crecimiento es parte de la virtud (Sabiduría).',
    isCompleted: false,
  },
  // Rutina de Tarde/Noche "Desconexión y Restauración"
  {
    id: '13',
    time: '18:00', // Example end of work
    text: '# Transición Trabajo-Hogar\n\nMarca un final claro a tu jornada laboral. Haz algo que simbolice el cambio (cambiarte de ropa, salir a caminar brevemente).',
    isCompleted: false,
  },
  {
    id: '14',
    time: '18:30',
    text: '# Actividad Restauradora\n\nDedica tiempo a hobbies, familia, amigos, lectura (filosofía estoica: Marco Aurelio, Epicteto, Séneca), o simplemente relajarte sin pantallas.',
    isCompleted: false,
  },
  {
    id: '15',
    time: '19:30',
    text: '# Cena Ligera y Saludable\n\nSimilar al desayuno y almuerzo, enfócate en comida real y come conscientemente.',
    isCompleted: false,
  },
  {
    id: '16',
    time: '20:30',
    text: '# Preparación para Mañana (15 min)\n\n- Revisa brevemente la agenda del día siguiente.\n- Prepara tu ropa, mochila, o lo que necesites.\n- Ordena tu espacio de trabajo. Reduce fricción matutina.',
    isCompleted: false,
  },
  {
    id: '17',
    time: '20:45',
    text: '# Reflexión Nocturna Estoica (5-10 min)\n\n- ¿Cómo apliqué mis principios hoy? ¿Dónde actué con virtud?\n- ¿Dónde me dejé llevar por emociones negativas? ¿Qué pude haber hecho diferente? (Observa para aprender).\n- ¿Qué aprendí hoy?\n- ¿Por qué estoy agradecido hoy?',
    isCompleted: false,
  },
  {
    id: '18',
    time: '21:00',
    text: '# Desconexión Digital\n\nApaga pantallas (TV, móvil, tablet) al menos 30-60 minutos antes de dormir. La luz azul interfiere con la melatonina.',
    isCompleted: false,
  },
  {
    id: '19',
    time: '21:30',
    text: '# Rutina Relajante Pre-Sueño\n\nLee un libro físico, escucha música tranquila, meditación ligera, estiramientos suaves.',
    isCompleted: false,
  },
  {
    id: '20',
    time: '22:00', // Example bedtime
    text: '# Dormir (7-8 horas)\n\nAcuéstate y levántate a la misma hora. El sueño es crucial para la función cognitiva, estado de ánimo, salud física y disciplina.',
    isCompleted: false,
  },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Home component displaying tasks in a carousel.
 * - Shows one task per view.
 * - Displays task with time closest to the current time on app open.
 * - Allows marking tasks as complete.
 * - Navigates to the next incomplete task upon completion.
 */
export default function Home(): React.ReactElement {
  const { bottom } = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = useRef<
    Carousel & { scrollToIndex: (index: number, animated: boolean) => void }
  >(null);

  // Special effect that only runs once on mount to determine the initial task to display
  useEffect(() => {
    const findClosestTask = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      console.log(
        `Current time: ${currentHour}:${currentMinute} (${currentTimeInMinutes} minutes)`
      );

      // Include ALL tasks, not just incomplete ones for determining initial view
      const tasksWithIndices = tasks.map((task, index) => ({
        ...task,
        originalIndex: index,
      }));

      if (tasksWithIndices.length === 0) {
        setCurrentIndex(-1); // No tasks available
        return;
      }

      const tasksWithTimeInMinutes = tasksWithIndices.map((task) => {
        const [hours, minutes] = task.time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        console.log(
          `Task ${task.id}: ${hours}:${minutes} (${timeInMinutes} minutes), diff: ${Math.abs(timeInMinutes - currentTimeInMinutes)}`
        );
        return { ...task, timeInMinutes };
      });

      // Find task with closest time to current time
      tasksWithTimeInMinutes.sort((a, b) => {
        const aTime = a.timeInMinutes ?? 0;
        const bTime = b.timeInMinutes ?? 0;

        // Calculate time difference with consideration for day wrapping
        let aDiff = Math.abs(aTime - currentTimeInMinutes);
        let bDiff = Math.abs(bTime - currentTimeInMinutes);

        // If time difference is more than 12 hours, consider it might be closer going the other way
        // around the 24-hour clock (e.g., 23:00 is closer to 01:00 than it appears)
        if (aDiff > 12 * 60) {
          aDiff = 24 * 60 - aDiff;
        }
        if (bDiff > 12 * 60) {
          bDiff = 24 * 60 - bDiff;
        }

        console.log(
          `Comparing: Task ${a.id} diff=${aDiff} vs Task ${b.id} diff=${bDiff}`
        );
        return aDiff - bDiff;
      });

      // The first task after sorting is the closest to current time
      const closestTask = tasksWithTimeInMinutes[0];
      const targetIndex = closestTask.originalIndex;

      console.log(
        `Selected task ${closestTask.id} at index ${targetIndex} (${closestTask.time})`
      );

      setCurrentIndex(targetIndex);
      // if (carouselRef.current && tasks[targetIndex]) {
      //   // Use a slight delay to ensure the carousel is ready
      //   setTimeout(() => {
      //     carouselRef.current?.scrollToIndex(targetIndex, false);
      //   }, 100);
      // }
    };

    findClosestTask();
  }, [tasks]); // Empty dependency array - run once on mount

  // Separate effect that handles task completion - this can depend on tasks
  useEffect(() => {
    // Only for task completion, not initial loading
    if (tasks.some((task) => task.isCompleted)) {
      // This logic only runs when tasks are completed, not on initial mount
      const currentTask = tasks[currentIndex];
      if (currentTask && currentTask.isCompleted) {
        // Find the next incomplete task
        const nextIncompleteIndex = tasks.findIndex(
          (task, i) => i > currentIndex && !task.isCompleted
        );

        if (nextIncompleteIndex !== -1) {
          setCurrentIndex(nextIncompleteIndex);
          if (carouselRef.current) {
            carouselRef.current.scrollToIndex(nextIncompleteIndex, true);
          }
        }
      }
    }
  }, [tasks, currentIndex]);

  useEffect(() => {
    // When currentIndex changes, scroll the carousel to the new index
    if (
      carouselRef.current &&
      currentIndex >= 0 &&
      currentIndex < tasks.length
    ) {
      // Ensure a small delay to allow the carousel to be ready, especially on initial load
      setTimeout(() => {
        carouselRef.current?.scrollToIndex(currentIndex, false); // Added 'false' for animated parameter
      }, 100); // 100ms delay, adjust if needed
    }
  }, [currentIndex, tasks]); // Include entire tasks array as dependency

  const handleCompleteTask = (completedTaskId: string): void => {
    const updatedTasks = tasks.map((task) =>
      task.id === completedTaskId ? { ...task, isCompleted: true } : task
    );
    setTasks(updatedTasks);

    // Find the current task's index that was just completed
    const completedTaskIndex = tasks.findIndex(
      (task) => task.id === completedTaskId
    );

    // Find the next incomplete task, starting from the current position and wrapping around
    let nextIncompleteTaskIndex = -1;

    // First try to find an incomplete task after the current position
    for (let i = completedTaskIndex + 1; i < updatedTasks.length; i++) {
      if (!updatedTasks[i].isCompleted) {
        nextIncompleteTaskIndex = i;
        break;
      }
    }

    // If no incomplete task found after current position, look from the beginning
    if (nextIncompleteTaskIndex === -1) {
      for (let i = 0; i < completedTaskIndex; i++) {
        if (!updatedTasks[i].isCompleted) {
          nextIncompleteTaskIndex = i;
          break;
        }
      }
    }

    const allTasksNowComplete = updatedTasks.every((task) => task.isCompleted);

    if (allTasksNowComplete) {
      // All tasks are complete, stay on the current task
      console.log('All tasks completed!');
    } else if (nextIncompleteTaskIndex !== -1) {
      // Navigate to the next incomplete task
      if (carouselRef.current) {
        carouselRef.current?.scrollToIndex(nextIncompleteTaskIndex, true);
      }
      setCurrentIndex(nextIncompleteTaskIndex);
    }
  };

  // Handle edge cases for rendering
  if (tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTasksText}>No tasks available.</Text>
      </View>
    );
  }

  // Ensure currentIndex is valid (especially during initial load or if tasks array changes drastically)
  // This also handles the -1 case for when all tasks might initially be marked as complete or list is empty.
  if (
    currentIndex < 0 ||
    currentIndex >= tasks.length ||
    !tasks[currentIndex]
  ) {
    // Attempt to find the first incomplete task, or default to 0 if all are complete
    const firstIncomplete = tasks.findIndex((task) => !task.isCompleted);
    const validIndex = firstIncomplete !== -1 ? firstIncomplete : 0;
    if (tasks[validIndex]) {
      // Check if this fallback index is even valid
      setCurrentIndex(validIndex); // This will trigger a re-render
      if (carouselRef.current) {
        carouselRef.current?.scrollToIndex(validIndex, false);
      }
    }
    // Render a loading or fallback view while state updates
    return (
      <View style={styles.container}>
        <Text style={styles.noTasksText}>Loading task...</Text>
      </View>
    );
  }

  // Render the main carousel with tasks
  return (
    <Carousel
      style={styles.carouselContainer}
      showsControls={false}
      showsDots={false}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      index={currentIndex}
    >
      {tasks.map((task, index) => (
        <View key={index} style={styles.slide}>
          <ScrollView
            automaticallyAdjustsScrollIndicatorInsets
            contentInsetAdjustmentBehavior='automatic'
            contentInset={{ bottom: bottom }}
            scrollIndicatorInsets={{ bottom: bottom }}
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.taskTime}>{task.time}</Text>
              <Markdown
                style={{
                  heading1: markdownStyles.heading1,
                  heading2: markdownStyles.heading2,
                  heading3: markdownStyles.heading3,
                  bullet_list_icon: markdownStyles.bullet_list_icon,
                  em: markdownStyles.em,
                  body: markdownStyles.body,
                }}
              >
                {task.text}
              </Markdown>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            {!task.isCompleted && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleCompleteTask(task.id)}
              >
                <Text style={styles.completeButtonText}>Mark as Complete</Text>
              </TouchableOpacity>
            )}
            {task.isCompleted && (
              <Text style={styles.completedText}>Completed!</Text>
            )}
          </View>
        </View>
      ))}
    </Carousel>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Adjust as needed for status bar, etc.
  },
  carouselContainer: {
    height: screenHeight * 0.6, // 60% of screen height
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: screenWidth,
    height: '100%', // Ensure slide takes full height of carousel
    justifyContent: 'flex-start', // Changed from center to start for better content flow
    alignItems: 'center',
    paddingHorizontal: 20, // Add some padding
    position: 'relative', // For absolute positioning of button
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    paddingBottom: 70, // Space for the button
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  taskTime: {
    fontSize: 16, // Larger font for time
    fontWeight: 'bold',
    color: MONOCHROMATIC_DOT_INACTIVE_COLOR, // Use defined mono color
    marginBottom: 20, // Space between time and markdown
  },
  completedText: {
    fontSize: 20,
    color: MONOCHROMATIC_TEXT_COLOR, // Use defined mono color (was green)
    textAlign: 'center',
    padding: 20,
  },
  noTasksText: {
    fontSize: 18,
    color: MONOCHROMATIC_TEXT_COLOR, // Use defined mono color
    textAlign: 'center',
    padding: 20,
  },
  completeButton: {
    borderColor: MONOCHROMATIC_BORDER_COLOR,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#000000', // Ensure button has a background
    minWidth: 150, // Set a minimum width for the button
    maxWidth: 200, // Limit maximum width
  },
  completeButtonText: {
    color: MONOCHROMATIC_TEXT_COLOR, // Same style as regular button text
    fontSize: 14,
    textAlign: 'center',
  },
  dot: {
    // Style for each dot
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MONOCHROMATIC_DOT_INACTIVE_COLOR, // Use constant
    marginHorizontal: 4,
  },
  activeDot: {
    // Style for the active dot
    backgroundColor: MONOCHROMATIC_DOT_ACTIVE_COLOR, // Use constant
  },
});
